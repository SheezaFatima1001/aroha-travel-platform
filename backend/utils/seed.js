import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Destination from '../models/Destination.js';
import Service from '../models/Service.js';

dotenv.config();

const destinations = [
  {
    name: 'Hunza Valley',
    country: 'Pakistan',
    location: 'Gilgit-Baltistan',
    description:
      'A high-altitude valley ringed by Rakaposhi and the Karakoram peaks, famous for terraced orchards, glacial lakes, and centuries-old forts.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hunza%20Valley%20in%20Giligit-Baltistan.jpg?width=1200',
    category: 'Mountains',
    rating: 4.9,
    popularity: 98,
    featured: true,
  },
  {
    name: 'Skardu',
    country: 'Pakistan',
    location: 'Gilgit-Baltistan',
    description:
      'Gateway to K2 and the Karakoram, with turquoise lakes, cold deserts, and some of the most dramatic mountain scenery on Earth.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shighar%20Valley%20Skardu.JPG?width=1200',
    category: 'Adventure',
    rating: 4.8,
    popularity: 95,
    featured: true,
  },
  {
    name: 'Murree',
    country: 'Pakistan',
    location: 'Punjab',
    description:
      'A colonial-era hill station in the Galyat range, popular for pine forests, mist-covered ridgelines, and easy weekend escapes.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful%20landscape%20of%20murree%20Pakistan.jpg?width=1200',
    category: 'Nature',
    rating: 4.2,
    popularity: 80,
    featured: false,
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    location: 'Punjab',
    description:
      'The cultural heart of Pakistan, home to Mughal architecture, walled-city bazaars, and a legendary food scene.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Badshahi%20Mosque%20Lahore%202014.JPG?width=1200',
    category: 'Historical',
    rating: 4.7,
    popularity: 92,
    featured: true,
  },
  {
    name: 'Islamabad',
    country: 'Pakistan',
    location: 'Federal Capital',
    description:
      'A planned capital set against the Margalla Hills, known for green spaces, modern architecture, and the Faisal Mosque.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shah%20Faisal%20Masjid%2C%20Islamabad.JPG?width=1200',
    category: 'Cities',
    rating: 4.4,
    popularity: 85,
    featured: false,
  },
  {
    name: 'Swat Valley',
    country: 'Pakistan',
    location: 'Khyber Pakhtunkhwa',
    description:
      'Known as the Switzerland of Pakistan, with pine-covered slopes, the Swat River, and alpine meadows around Kalam and Malam Jabba.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kalam%2C%20Swat%20%28Pakistan%29.jpg?width=1200',
    category: 'Nature',
    rating: 4.7,
    popularity: 90,
    featured: true,
  },
  {
    name: 'Naran',
    country: 'Pakistan',
    location: 'Khyber Pakhtunkhwa',
    description:
      'Base camp for Lake Saiful Muluk and the Kaghan Valley, with glacial lakes and jeep tracks into the high mountains.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Saiful%20Muluk%20%28Naran%20Valley%29.JPG?width=1200',
    category: 'Adventure',
    rating: 4.6,
    popularity: 88,
    featured: false,
  },
  {
    name: 'Karachi',
    country: 'Pakistan',
    location: 'Sindh',
    description:
      'A sprawling port city on the Arabian Sea, with colonial architecture, beachfront promenades, and Pakistan\u2019s liveliest nightlife.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karachi%20Clifton%20Skyline.JPG?width=1200',
    category: 'Cities',
    rating: 4.1,
    popularity: 75,
    featured: false,
  },
  {
    name: 'Kalash Valley',
    country: 'Pakistan',
    location: 'Chitral, Khyber Pakhtunkhwa',
    description:
      'Home to the Kalasha people, one of Pakistan\u2019s smallest and most distinct indigenous communities, with a unique language, dress, and pre-Islamic traditions preserved across three Hindu Kush valleys.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bumburet%20Valley%20in%20Chitral%20District%2C%20Pakistan%201.jpg?width=1200',
    category: 'Cultural',
    rating: 4.6,
    popularity: 65,
    featured: false,
  },
  {
    name: 'Shrine of Shah Rukn-e-Alam',
    country: 'Pakistan',
    location: 'Multan, Punjab',
    description:
      'A 13th-century Sufi shrine and one of the most important pilgrimage sites in the Punjab region, renowned for its glazed-tile domes and classical Multani architecture.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shah%20Rukn-e-Alam%20Shrine.jpg?width=1200',
    category: 'Religious',
    rating: 4.5,
    popularity: 60,
    featured: false,
  },
  {
    name: 'Shangri-La Resort, Skardu',
    country: 'Pakistan',
    location: 'Skardu, Gilgit-Baltistan',
    description:
      'A private lakeside luxury resort built around the turquoise Lower Kachura Lake, framed by pine forests and snow-capped peaks.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shngrilla%20Resort%2C%20District%20Skardu%2C%20Pakistan.JPG?width=1200',
    category: 'Luxury',
    rating: 4.8,
    popularity: 70,
    featured: false,
  },
  {
    name: 'Gwadar Beach',
    country: 'Pakistan',
    location: 'Gwadar, Balochistan',
    description:
      'A quiet stretch of Arabian Sea coastline on Pakistan\u2019s southwestern tip, with wide sandy beaches, fishing boats, and views out to the Gwadar Bay headland.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/GWADAR%20BEACH.jpg?width=1200',
    category: 'Beaches',
    rating: 4.2,
    popularity: 55,
    featured: false,
  },
];

const services = [
  {
    serviceName: 'Serena Hunza Boutique Stay',
    category: 'Hotels',
    location: 'Hunza Valley',
    description: 'A mountain-view boutique hotel with orchard gardens and locally sourced dining.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shngrilla%20Resort%2C%20District%20Skardu%2C%20Pakistan.JPG?width=1200',
    price: 145,
    rating: 4.8,
    availability: true,
    features: ['Mountain view', 'Breakfast included', 'Free Wi-Fi', 'Airport pickup'],
  },
  {
    serviceName: 'K2 Basecamp Trek Guide',
    category: 'Guides',
    location: 'Skardu',
    description: 'Certified high-altitude guide for multi-day treks toward the Karakoram giants.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hunza%20Valley%2C%20view%20from%20Eagle%27s%20Nest.jpg?width=1200',
    price: 90,
    rating: 4.9,
    availability: true,
    features: ['Certified guide', 'Safety equipment', 'English-speaking', 'Custom routes'],
  },
  {
    serviceName: 'Karakoram Highway Jeep Transfer',
    category: 'Transport',
    location: 'Gilgit-Baltistan',
    description: 'Private 4x4 transport along the Karakoram Highway with an experienced mountain driver.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hunza%20River%2C%20Pakistan.jpg?width=1200',
    price: 60,
    rating: 4.5,
    availability: true,
    features: ['Private vehicle', 'Experienced driver', 'Flexible stops'],
  },
  {
    serviceName: 'Swat Valley Full-Day Tour',
    category: 'Tours',
    location: 'Swat Valley',
    description: 'Guided day tour through Mingora, Kalam, and the White Palace ruins.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kalam%20in%20Swat%20Pakistan%20G.jpg?width=1200',
    price: 55,
    rating: 4.6,
    availability: true,
    features: ['Small groups', 'Lunch included', 'Local guide'],
  },
  {
    serviceName: 'Lake Saiful Muluk Horseback Ride',
    category: 'Activities',
    location: 'Naran',
    description: 'Scenic horseback ride to the glacial lake with a local handler and photo stops.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Opposite%20side%20of%20lake%20saiful%20malook%20%2C%20naran%20%2C%20pakistan.JPG?width=1200',
    price: 25,
    rating: 4.3,
    availability: true,
    features: ['Local handler', 'Safety gear', 'Photo stops'],
  },
  {
    serviceName: 'Lahore Heritage Walking Package',
    category: 'Packages',
    location: 'Lahore',
    description: '3-day cultural package covering the Walled City, Badshahi Mosque, and Food Street.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Minaret%20of%20Badshahi%20Mosque%2C%20Lahore.JPG?width=1200',
    price: 210,
    rating: 4.7,
    availability: true,
    features: ['3 days / 2 nights', 'Hotel included', 'All meals', 'Private guide'],
  },
  {
    serviceName: 'Deosai Plains Wildlife Safari',
    category: 'Activities',
    location: 'Skardu',
    description: 'Full-day 4x4 safari across the high-altitude Deosai Plains, home to the Himalayan brown bear and vast alpine meadows.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Village%20near%20Skardu.JPG?width=1200',
    price: 70,
    rating: 4.7,
    availability: true,
    features: ['4x4 vehicle', 'Wildlife spotting', 'Packed lunch', 'Photography stops'],
  },
  {
    serviceName: 'Attabad Lake Boating Trip',
    category: 'Activities',
    location: 'Hunza Valley',
    description: 'Guided boat ride across the turquoise waters of Attabad Lake with stops at the lakeside viewpoints.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Attabad%20Lake%2C%20Hunza%20Pakistan.jpg?width=1200',
    price: 20,
    rating: 4.6,
    availability: true,
    features: ['Life jackets included', 'Local boatman', 'Photo stops'],
  },
  {
    serviceName: 'Murree Chairlift & Mall Road Tour',
    category: 'Tours',
    location: 'Murree',
    description: 'Half-day guided tour of Mall Road, Patriata chairlift, and the pine-forest viewpoints above Murree.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A%20beautiful%20view%20of%20Murree%2C%20Pakistan.jpg?width=1200',
    price: 35,
    rating: 4.3,
    availability: true,
    features: ['Chairlift ticket included', 'Local guide', 'Half-day'],
  },
  {
    serviceName: 'Islamabad City Highlights Tour',
    category: 'Tours',
    location: 'Islamabad',
    description: 'Guided city tour covering Faisal Mosque, Daman-e-Koh viewpoint, and the Margalla Hills trails.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Faisal%20Mosque%20-%20fountain%20area.jpg?width=1200',
    price: 40,
    rating: 4.5,
    availability: true,
    features: ['Small groups', 'Hotel pickup', 'English-speaking guide'],
  },
  {
    serviceName: 'Hunza Cultural Heritage Walk',
    category: 'Tours',
    location: 'Hunza Valley',
    description: 'Walking tour through Karimabad, Baltit Fort, and the orchard terraces with a local Hunzai guide.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Poplar%20Trees%20of%20Hunza%20Valley.jpg?width=1200',
    price: 30,
    rating: 4.8,
    availability: true,
    features: ['Local guide', 'Fort entry included', 'Small groups'],
  },
  {
    serviceName: 'Kaghan Valley Jeep Safari',
    category: 'Transport',
    location: 'Naran',
    description: 'Full-day 4x4 jeep safari from Naran through the upper Kaghan Valley, including Lake Saiful Muluk.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naraan%20Jheel%20saif%20ul%20malook%201.JPG?width=1200',
    price: 45,
    rating: 4.5,
    availability: true,
    features: ['4x4 jeep', 'Experienced driver', 'Full-day rental'],
  },
  {
    serviceName: 'Kalam Riverside Guesthouse',
    category: 'Hotels',
    location: 'Swat Valley',
    description: 'Cozy riverside guesthouse in Kalam with mountain views and easy access to the Swat River.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hotels%20in%20Kalam%20along%20the%20Swat%20River%20in%20Khyber%20Pakhtunkhwa%2C%20Pakistan%2008.jpg?width=1200',
    price: 60,
    rating: 4.4,
    availability: true,
    features: ['River view', 'Breakfast included', 'Free parking'],
  },
  {
    serviceName: 'Hunza Autumn Photography Tour',
    category: 'Tours',
    location: 'Hunza Valley',
    description: 'Seasonal photography tour timed to Hunza\u2019s golden autumn foliage, visiting the valley\u2019s best viewpoints.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Autumn%20in%20Hunza%20Valley%20Pakistan.jpg?width=1200',
    price: 50,
    rating: 4.9,
    availability: true,
    features: ['Golden hour timing', 'Photography guide', 'Small groups', 'Seasonal (Oct)'],
  },
];

const run = async () => {
  await connectDB();
  await Destination.deleteMany();
  await Service.deleteMany();
  await Destination.insertMany(destinations);
  await Service.insertMany(services);
  console.log('Seed data inserted successfully');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});