// backend/scripts/migrateOldProperties.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/propertymodel.js'; // note lowercase file name

dotenv.config({ path: '.env.local' }); // loads your Mongo URI

const OLD_COLLECTION = 'properties';

async function run() {
  try {
    const uri = process.env.MONGOURI || process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ No Mongo URI found in env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const oldColl = db.collection(OLD_COLLECTION);

    const oldDocs = await oldColl
      .find({ 'location.city': { $exists: false } })
      .toArray();

    console.log(`Found ${oldDocs.length} old docs to migrate`);

    for (const doc of oldDocs) {
      const exists = await Property.findOne({ title: doc.title, price: doc.price });
      if (exists) {
        console.log(`Skipping already migrated: ${doc.title}`);
        continue;
      }

      const city = doc.location || 'Unknown';
      const availability = (doc.availability || '').toLowerCase();
      const category = availability === 'rent' ? 'rent' : 'sell';

      const newProp = new Property({
        title: doc.title,
        description: doc.description || 'No description provided',
        price: doc.price || 0,
        type: (doc.type || 'apartment').toLowerCase(),
        category,
        location: {
          address: city,
          city,
          state: 'Unknown',
          pincode: '000000'
        },
        features: {
          bedrooms: doc.beds || 0,
          bathrooms: doc.baths || 0,
          area: doc.sqft || 0,
          amenities: doc.amenities || []
        },
        images: (doc.image || []).map((url, idx) => ({
          url,
          isPrimary: idx === 0
        })),
        owner: new mongoose.Types.ObjectId(), // dummy owner
        contactInfo: {
          phone: doc.phone || ''
        },
        status: 'available'
      });

      await newProp.save();
      console.log(`✅ Migrated: ${doc.title}`);
    }

    console.log('🎉 Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
