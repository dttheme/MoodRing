const faker = require('faker');
const mongoose = require('mongoose');

const { Post } = require('../posts/models')
const { User } = require('../users/models')

function sendAllDataToDb() {
  console.info('Sending data to database...');
  const testData = [];
  for (let i=1; i<=3; i++) {
    // console.log(generateTestData());
    testData.push(createTestUserAndPost());
  }
  return Post.insertMany(testData);
}

function generatePostData() {
  console.log(`Generating post data...`);
  return {
    rating: faker.random.number(),
    mood: faker.random.word(),
    activity: [faker.random.word()],
    note: faker.lorem.sentence(),
    publishedAt: faker.date.recent()
  }
}

function generateUserData() {
  console.log(`Generating user data...`);
  return {
    firstName: faker.name.firstName(),
    username: faker.internet.email(),
    password: faker.internet.password()
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndPost(i) {
  // console.log(`Creating user ${i+1}`);
  return User.create(generateUserData())
    .then(user => {
      let userId = user._id;
      let username = user.username;
      const data = [];
      for(let x = 0; x <= 3; x++) {
        // console.log(`Generating post ${x+1} for user ${username}`);
        let newPost = generatePostData();
        newPost.author = userId;
        data.push(Post.create(newPost));
      }
      console.log(`Generated posts`);
      console.log(data);
      return Promise.all(data);
    })
}

function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

module.exports = { sendAllDataToDb, generatePostData, generateUserData, createTestUser, tearDownDb }
