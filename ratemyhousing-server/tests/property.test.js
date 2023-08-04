const config = require('config');
const mongoose = require('mongoose');
const {
  Property
} = require('../models/schema_property');
const {
  PropertyReview
} = require('../models/schema_propertyReview');
const { User,
  validateEmail } = require('../models/schema_user');
const dbUrl = config.get('db.dbUrl');
const app = require('../app');
const { validatePostalCode } = require('../models/schema_address');
const supertest = require('supertest');
const { ROLE } = require('../models/roles');
const request = supertest(app);

jest.setTimeout(15000);
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createTestUser(){
  const res = await request.post('/auth/signup').send(
      {
          email:"test@example.com",
          name: "exampleUser1",
          password:"test123",
          phoneNo:"123-425-729"
      }
  )
  return res;
}

async function loginTestUser(){
  const res = await request.post('/auth/login').send(
    {
      email: "test@example.com",
      password:"test123"
    });
    return res;
}

async function logoutTestUser(refreshToken){
  const res = await request.post('/auth/logout').send(
      {
          token:refreshToken
      }
  );
  return res;
}


async function createAdminUser(){
  const adminEmailtest = "admintest@example.com";
  const res = await request.post('/auth/signup').send(
      {
          email:adminEmailtest,
          name: "exampleAdmin1",
          password:"test123",
          phoneNo:"123-425-729"
      }
  );
  await User.findOneAndUpdate({email: adminEmailtest},{role: ROLE.ADMIN});
  return res;
}


async function loginAdminUser(){
  const res = await request.post('/auth/login').send(
    {
      email:"admintest@example.com",
      password:"test123"
    });
    return res;
}

async function logoutAdminUser(refreshToken){
  const res = await request.post('/auth/logout').send(
      {
          token:refreshToken
      }
  );
  return res;
}

describe('Property tests', () => {
  beforeAll(async () => {
    await Property.deleteMany({});
    await PropertyReview.deleteMany({});
  });

  afterEach(async () => {
    await Property.deleteMany({});
    await PropertyReview.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('1. Unit tests - Validators',()=>{
    it('1. Validate postal code - Util function',()=>{
      let ret = validatePostalCode("N2L 6G8");
      expect(ret).toBe(true);
    });
  });

  describe('Property Creation Tests',()=>{
    let refreshToken;
    let accessToken;
    beforeAll(async ()=>{
      await User.deleteMany({});
      const res = await createTestUser();
      expect(res.status).toEqual(201);
    });

    afterAll(async ()=>{
      await User.deleteMany({});
    })

    beforeEach(async ()=>{
      let resAuth = await loginTestUser();
      expect(resAuth.status).toEqual(200);
      accessToken = resAuth.body.data.token;
      refreshToken = resAuth.body.data.refreshToken;
    })

    afterEach(async ()=>{
      let resAuth = await logoutTestUser(refreshToken);
      expect(resAuth.status).toEqual(200);
    })

    it('1. Create property test - create one property with minimal field required', async function() {

      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          propertyType: 'Condo',
          address: {
            state: 'On',
            city: 'Waterloo',
            street: 'teststreet',
            postalCode: 'N2L 3Y7'
          }
        })
        .expect(201);
      expect(res.body.message).toBe("Property creation success");
      expect(res.body.success).toBe(true);
      var prop_id = res.body.data;
      const propertyFound = await Property.findById(prop_id);
      expect(propertyFound).toBeDefined();

    });
  
    it('2. Create property test - create one property with all field', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          name: "myproperty",
          propertyType: 'Condo',
          landlord: 'landlord',
          propertyManagement: 'management',
          propertyWebsite: 'website',
          address: {
            country: "Canada",
            state: 'On',
            city: 'Waterloo',
            street: 'teststreet',
            postalCode: 'N2L 3Y7'
          },
          overallRating: 2.5,
          pictures: ["pic1"],
          reviews: {}
        })
        .expect(201);
      expect(res.body.message).toBe("Property creation success");
      expect(res.body.success).toBe(true);
      var prop_id = res.body.data;
      const propertyFound = await Property.findById(prop_id);
      expect(propertyFound).toBeDefined()
    });
  
    it('3. Create property test - should not create property and throw an error since propertyType is not provided', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          address: {
            state: 'On',
            city: 'Waterloo',
            street: 'teststreet',
            postalCode: 'N2L 3Y7'
          }
        })
        .expect(500);
    });
  
    it('4. Create property test - should not create property and throw an error since state is not provided ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          propertyType: 'Condo',
          address: {
            city: 'Waterloo',
            street: 'teststreet',
            postalCode: 'N2L 3Y7'
          }
        })
        .expect(500);
    });
  
    it('5. Create property test - should not create property and throw an error since city is not provided ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          propertyType: 'Condo',
          address: {
            state: 'On',
            street: 'teststreet',
            postalCode: 'N2L 3Y7'
          }
        })
        .expect(500);
    });
  
    it('6. Create property test - should not create property and throw an error since street is not provided ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          propertyType: 'Condo',
          address: {
            state: 'On',
            city: 'Waterloo',
            postalCode: 'N2L 3Y7'
          }
        })
        .expect(500);
    });
  
    it('7. Create property test - should not create property and throw an error since postalCode is not provided ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
          propertyType: 'Condo',
          address: {
            state: 'On',
            city: 'Waterloo',
            street: 'teststreet',
          }
        })
        .expect(500);
    });
  
    it('8. Create property test - should not create property and throw an error since body is empty ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({})
        .expect(500);
    });  

    it('9. Create property test - should not create property without address ', async function() {
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
        name: "myproperty",
        propertyType: 'Condo',
        landlord: 'landlord',
        propertyManagement: 'management',
        propertyWebsite: 'website',
        overallRating: 2.5,
        pictures: ["pic1"],
        reviews: {}
      }).expect(500);
    });
  
    it('10. Create property test - check if amenities are readable', async function() {
      const expected = [
        {
          amenity:"Gym",
          available:true
        },
        {
          amenity:"Pool",
          available:true
        }
      ];
      const res = await request.post('/property').set('Authorization', `Bearer ${accessToken}`).send({
        name: "myproperty",
        propertyType: 'Condo',
        landlord: 'landlord',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
        propertyManagement: 'management',
        propertyWebsite: 'website',
        pictures: ["pic1"],
        reviews: {},
        amenities: expected,
      }).expect(201);
      const actual = await Property.findById(res.body.data);
      expect(actual.amenities[0].amenity).toEqual(expected[0].amenity);
      expect(actual.amenities[1].amenity).toEqual(expected[1].amenity);
      expect(actual.amenities[0].available).toEqual(expected[0].available);
      expect(actual.amenities[1].available).toEqual(expected[1].available);
    });
  });
  
  it('9. Read property test - should read property properly with minimal field required', async function() {
    const newProperty = new Property({
      propertyType: 'Condo',
      address: {
        state: 'On',
        city: 'Waterloo',
        street: 'teststreet',
        postalCode: 'N2L 3Y7'
      }
    });
    await newProperty.save();
    var id = newProperty.id;
    var temp_route = '/property/' + id;
    const res = await request.get(temp_route).send()
    .expect(200);
    expect(res.body.message).toBe("Property found successful");
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('10. Read property test - should read property properly with all field required', async function() {
    const newProperty = new Property({
      name: "myproperty",
      propertyType: 'Condo',
      landlord: 'landlord',
      propertyManagement: 'management',
      propertyWebsite: 'website',
      address: {
        country: "Canada",
        state: 'On',
        city: 'Waterloo',
        street: 'teststreet',
        postalCode: 'N2L 3Y7'
      },
      overallRating: 2.5,
      pictures: ["pic1"],
      reviews: {}
    });
    await newProperty.save();
    var id = newProperty.id;
    var temp_route = '/property/' + id;
    const res = await request.get(temp_route).send()
    .expect(200);
    expect(res.body.message).toBe("Property found successful");
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('11. Read property test - should respond 404 if cannot find the property', async function() {
    var temp_route = '/property/' + '6211b5b3db8a7c19561c2202';
    const res = await request.get(temp_route).send()
    .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Property not found');
  });

  it('12. Read property test - should throw an error if the id given is not in correct format', async function() {
    var temp_route = '/property/' + '211231354';
    const res = await request.get(temp_route).send()
    .expect(400);
  });

  it('13.Delete property - Delete property API',async () => {
    const prop = { propertyType: 'Condo',
      address: {
        state: 'On',
        city: 'Waterloo',
        street: 'teststreet',
        postalCode: 'N2L 3Y7'
      }
    }
    const newProperty = new Property(prop);
    await newProperty.save();

    const res = await request.delete(`/property/${newProperty.id}`)
    .expect(200);
    expect(res.statusCode).toBe(200)
    expect(res.body.data._id).toBe(newProperty.id);
  });


  it('14. Delete property that does not exist - Delete API',async () => {
      const randomId = "621a8c382379874d37abd2cb";
      const res = await request.delete(`/property/${randomId}`)
      .expect(400);
      expect(res.body.message).toBe("Property not found");
      expect(res.body.success).toBe(false);
  });


  it('15.Update property - Update property API ', async () => {

    const newProperty = new Property({
      propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
    });
    newProperty.save();
    expect(newProperty.propertyType).toBe('Condo');

    const updatedValues = {
      property: {
        propertyType: 'Apartment'
      }
    }
    const res = await request.put(`/property/${newProperty.id}`).send(
      updatedValues
    )
    .expect(200);
    expect(res.body.data._id).toBe(newProperty.id);
    expect(res.body.data.propertyType).toBe('Apartment');
  });


  // it('16.Update property with random data for property type field- Update property API ', async () => {
  //
  //   const newProperty = new Property({
  //     propertyType: 'Condo',
  //       address: {
  //         state: 'On',
  //         city: 'Waterloo',
  //         street: 'teststreet',
  //         postalCode: 'N2L 3Y7'
  //       }
  //   });
  //   newProperty.save();
  //   expect(newProperty.propertyType).toBe('Condo');
  //
  //   const updatedValues = {
  //     property: {
  //       propertyType: 'Waterloo'
  //     }
  //   }
  //   const res = await request.put(`/property/${newProperty.id}`).send(
  //     updatedValues
  //   )
  //   .expect(500);
  //   expect(res.body.message).toBe("Error Updating property");
  //   expect(res.body.success).toBe(false);
  // });

  it('17.Update property with wrong postal code format- Update property API ', async () => {

    const newProperty = new Property({
      propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
    });
    newProperty.save();
    expect(newProperty.propertyType).toBe('Condo');

    const updatedValues = {
      property: {
        address:{
          postalCode: '2N3 LY7'
        }
      }
    }
    const res = await request.put(`/property/${newProperty.id}`).send(
      updatedValues
    )
    .expect(500);
    expect(res.body.message).toBe("Error Updating property");
    expect(res.body.success).toBe(false);
  });


  describe('Review API test', () => {

    it('1. Create review test - create one review with minimal field required', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      const res = await request.post(`/review/${id}`).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"})
      .expect(201);

      expect(res.body.message).toBe("Review creation success");
      expect(res.body.success).toBe(true);
      var review_id = res.body.data;
      const reviewFound = await PropertyReview.findById(review_id);
      expect(reviewFound).toBeDefined();
    });

    it('2. Create review test - create one review with all fields', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      })
      .expect(201);

      expect(res.body.message).toBe("Review creation success");
      expect(res.body.success).toBe(true);
      var review_id = res.body.data;
      const reviewFound = await PropertyReview.findById(review_id);
      expect(reviewFound).toBeDefined()
    });

    it('3. Create review test - should throw an error since parent_property_id is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('4. Create review test - should throw an error since costReview is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('5. Create review test - should throw an error since overallRatingReview is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('6. Create review test - should throw an error since landlordRating is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('7. Create review test - should throw an error since neighborhood is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('8. Create review test - should throw an error since crowdedness is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:1,
        cleanliness: 3,
        accessibility: 4,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('9. Create review test - should throw an error since cleanliness is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:3,
        crowdedness: 2,
        accessibility: 1,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('10. Create review test - should throw an error since accessibility is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        textReview: "this is textReview",
        datePosted:"2021-1-1"
      })
      .expect(500);
    });

    it('11. Create review test - should throw an error since textReview is missing', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + id;
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        datePosted:"2021-1-1"
      })
      .expect(500);
    });


    it('14. Create review test - should throw an error if property id is in a wrong format', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/review/' + 'zdfaefzcxfasdf';
      const res = await request.post(temp_route).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"testett"
      })
      .expect(400);
    });

    it('15. Create review test - should throw an error if property id is invalid', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      const res = await request.post(`/review/${newProperty.id}1`).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"testett"
      })
      .expect(400);
    });


    it('16. Create review test - should throw an error if property doest exist', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      const res = await request.post(`/review/621d870287931fa3c89a5508`).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        datePosted:"testett"
      })
      .expect(404);
    });

    it('17. Read review test - should read the review properly', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await newReview.save();
      var review_id = newReview.id;
      var temp_route = '/review/' + review_id;
      const res = await request.get(`/review/${newReview.parent_property_id}/${review_id}`).send().
      expect(200);
      expect(res.body.message).toBe("Review found successful");
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('18. Read review test - should throw an 400 error if review id is in a wrong format', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:1,
        crowdedness: 2,
        cleanliness: 5,
        accessibility: 2,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      var review_id = "asdfczxfd";
      const res = await request.get(`/review/${newReview.parent_property_id}/${review_id}`).send().
      expect(400);
    });

    it('19. Read review test - should throw an 404 error if review is not found', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await newReview.save();
      var review_id = "621d870287931fa3c89a5508";
      const res = await request.get(`/review/${newReview.parent_property_id}/${review_id}`).send().
      expect(404);
    });

    it('20. Update review test - should update review properly', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();

      const newReview = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:1,
        crowdedness: 2,
        cleanliness: 4,
        accessibility: 0,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      expect(newReview.costReview).toBe(1000);

      const updateVlue = {
        review:{
          costReview: 500
        }
      }
      const res = await request.put(`/review/${newProperty.id}/${newReview.id}`).send(
        updateVlue
      ).expect(200);
      expect(res.body.data._id).toBe(newReview.id);
      expect(res.body.data.costReview).toBe(500);
    });

    it('21. Update review test - should throw an 400 error if reviewid is in a wrong format', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      expect(newReview.costReview).toBe(1000);

      const updateVlue = {
        review:{
          costReview: 250
        }
      }
      const res = await request.put(`/review/${newReview.parent_property_id}/1321564241`).send(
        updateVlue
      ).expect(400);
    });

    it('22. Update review test - should throw an 404 error if not found this review', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      expect(newReview.costReview).toBe(1000);

      const updateVlue = {
        review:{
          costReview: 500
        }
      }
      const res = await request.put(`/review/${newReview.parent_property_id}/621d870287931fa3c89a5508`).send(
        updateVlue
      ).expect(404);
    });

    it('23. Update review test - should throw an error if property_id is not valid', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      expect(newReview.costReview).toBe(1000);

      const updateVlue = {
        review:{
          costReview: 500
        }
      }
      const res = await request.put(`/review/621d870287931fa3c89a5108/${newReview.id}`).send(
        updateVlue
      ).expect(404);
    });


    it('24. Delete review test - should delete review properly', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();

      let res = await request.post(`/review/${newProperty.id}`).send({
        parent_property_id: newProperty.id,
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:0,
        crowdedness: 1,
        cleanliness: 2,
        accessibility: 3,
        textReview: "this is textReview",
        datePosted:"2021-1-1"})
      .expect(201);
      const created_review = res.body.data;
      res = await request.delete(`/review/${newProperty.id}/${res.body.data}`)
      .expect(200);
      expect(res.statusCode).toBe(200)
      expect(res.body.data._id).toBe(created_review);
    });

    it('25. Delete review test - should throw an 404 error if not found this review', async function() {

      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();

      const newReview = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();

      const randomId = "621a8c382379874d37abd2cb";
      const res = await request.delete(`/review/${newProperty.id}/${randomId}`)
      .expect(404);
      expect(res.body.message).toBe("Review not found");
      expect(res.body.success).toBe(false);
    });

    it('26. Delete review test - should throw an 404 error if invalid property id is given', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();

      const newReview = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();

      const non_existing_prop_id = "621a8c382379874d37abd2cb"
      const res = await request.delete(`/review/${non_existing_prop_id}/${newReview.id}`)
      .expect(404);
      expect(res.body.message).toBe("No valid parent property found");
      expect(res.body.success).toBe(false);
    });

    it('27. Delete review test - should throw an 400 error if id is in wrong format', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
        comments:[]
      });
      await newReview.save();

      const randomId = "231654";
      const res = await request.delete(`/review/${newReview.parent_property_id}/${randomId}`)
      .expect(400);
      expect(res.body.message).toBe("Invalid review id");
      expect(res.body.success).toBe(false);
    });


    it('28. Fetch all reviews - should read all reviews of a property', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/property/' + id;
      let res = await request.get(temp_route).send()
      .expect(200);

      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });

      const rev2 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im tenant",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is a tenant review",
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });

      await rev1.save();
      await rev2.save();

      res = await request.get(`/review/${newProperty.id}`)
      .expect(200);
      expect(res.body.data[0]._id).toEqual(rev1.id);
      expect(res.body.data[1]._id).toEqual(rev2.id);
      expect(res.body.data[0].voteUp).toEqual(0);
      expect(res.body.data[1].voteUp).toEqual(0);
      expect(res.body.data[0].voteDown).toEqual(0);
      expect(res.body.data[1].voteDown).toEqual(0);
    });


    it('29. Fetch all reviews - should throw error on passing non invalid property id', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      var id = newProperty.id;
      var temp_route = '/property/' + id;
      let res = await request.get(temp_route).send()
      .expect(200);

      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });

      await rev1.save();

      res = await request.get(`/review/${newProperty.id}1`)
      .expect(400);
    });

    it('30. Fetch all reviews - should throw error on passing non existant property id', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });

      await rev1.save();

      res = await request.get(`/review/${rev1.id}`)
      .expect(404);
    });

    it('31. Add Review rating calculation correctness - 5 reviews with different ratings', async function() {
      let newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      let res;
      for(let i =1; i<= 5;++i){
          res = await request.post(`/review/${id}`).send({
          parent_property_id: id,
          costReview: 1000,
          overallRatingReview: i,
          landlordRating:i,
          neighborhood: 2,
          crowdedness: 3,
          cleanliness: 4,
          accessibility: 1,
          textReview: "this is textReview",
          datePosted:`2021-1-${i}`})
        .expect(201);
        expect(res.body.message).toBe("Review creation success");
        expect(res.body.success).toBe(true);
        var review_id = res.body.data;
        const reviewFound = await PropertyReview.findById(review_id);
        expect(reviewFound).toBeDefined();
      }
      newProperty = await Property.findById(newProperty.id);
      expect(newProperty.overallRating).toBe(3);
      expect(newProperty.ratingBreakDown.awesome).toBe(1);
      expect(newProperty.ratingBreakDown.great).toBe(1);
      expect(newProperty.ratingBreakDown.good).toBe(1);
      expect(newProperty.ratingBreakDown.ok).toBe(1);
      expect(newProperty.ratingBreakDown.aweful).toBe(1);
      expect(newProperty.totalReviewCount).toBe(5);
    });

    it('32. Delete Review - Rating calculation correctness - deleting a review after adding 5 reviews', async function() {
      let newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      let res;
      for(let i =1; i<= 5;++i){
          res = await request.post(`/review/${id}`).send({
          parent_property_id: id,
          costReview: 1000,
          overallRatingReview: i,
          landlordRating:i,
          neighborhood: 2,
          crowdedness: 3,
          cleanliness: 4,
          accessibility: 1,
          textReview: "this is textReview",
          datePosted:`2021-1-${i}`})
        .expect(201);
        expect(res.body.message).toBe("Review creation success");
        expect(res.body.success).toBe(true);
        let review_id = res.body.data;
        const reviewFound = await PropertyReview.findById(review_id);
        expect(reviewFound).toBeDefined();
      }
      //deleting the last review
      res = await request.delete(`/review/${newProperty.id}/${res.body.data}`)
      .expect(200);
      newProperty = await Property.findById(newProperty.id);
      expect(newProperty.overallRating).toBe(2.5);
      expect(newProperty.ratingBreakDown.awesome).toBe(0);
      expect(newProperty.ratingBreakDown.great).toBe(1);
      expect(newProperty.ratingBreakDown.good).toBe(1);
      expect(newProperty.ratingBreakDown.ok).toBe(1);
      expect(newProperty.ratingBreakDown.aweful).toBe(1);
      expect(newProperty.totalReviewCount).toBe(4);
    });


    it('33. Decimal value correctness rating calculation correctness', async function() {
      let newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      let res;
      for(let i =1; i< 5;++i){
          res = await request.post(`/review/${id}`).send({
          parent_property_id: id,
          costReview: 1000,
          overallRatingReview:1,
          landlordRating:0,
          neighborhood: 2,
          crowdedness: 3,
          cleanliness: 4,
          accessibility: 1,
          textReview: "this is textReview",
          datePosted:`2021-1-${i}`})
        .expect(201);
        expect(res.body.message).toBe("Review creation success");
        expect(res.body.success).toBe(true);
        let review_id = res.body.data;
        const reviewFound = await PropertyReview.findById(review_id);
        expect(reviewFound).toBeDefined();
      }
      res = await request.post(`/review/${id}`).send({
        parent_property_id: id,
        costReview: 1000,
        overallRatingReview:4,
        landlordRating:0,
        neighborhood: 2,
        crowdedness: 3,
        cleanliness: 4,
        accessibility: 1,
        textReview: "this is textReview",
        datePosted:`2021-1-1`})
      .expect(201);
      expect(res.body.message).toBe("Review creation success");
      expect(res.body.success).toBe(true);
      let review_id = res.body.data;
      const reviewFound = await PropertyReview.findById(review_id);
      expect(reviewFound).toBeDefined();


      newProperty = await Property.findById(newProperty.id);
      expect(newProperty.overallRating).toBe(1.6);
      expect(newProperty.ratingBreakDown.awesome).toBe(0);
      expect(newProperty.ratingBreakDown.great).toBe(1);
      expect(newProperty.ratingBreakDown.good).toBe(0);
      expect(newProperty.ratingBreakDown.ok).toBe(0);
      expect(newProperty.ratingBreakDown.aweful).toBe(4);
      expect(newProperty.totalReviewCount).toBe(5);
    });

    it('34. Updating a Review - rating calculation correctness - update a 1 star review to 3.5', async function() {
      let newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var id = newProperty.id;
      let res;
      let testReviewList = [];
      for(let i =1; i< 5;++i){
          res = await request.post(`/review/${id}`).send({
          parent_property_id: id,
          costReview: 1000,
          overallRatingReview:1,
          landlordRating:0,
          neighborhood: 2,
          crowdedness: 3,
          cleanliness: 4,
          accessibility: 1,
          textReview: "this is textReview",
          datePosted:`2021-1-${i}`})
        .expect(201);
        expect(res.body.message).toBe("Review creation success");
        expect(res.body.success).toBe(true);
        let review_id = res.body.data;
        testReviewList.push(review_id);
        const reviewFound = await PropertyReview.findById(review_id);
        expect(reviewFound).toBeDefined();
      }

      const updateVlue = {
        review:{
          overallRatingReview: 3.5
        }
      };

      res = await request.put(`/review/${id}/${res.body.data}`).send(updateVlue)
      .expect(200);
      let review_id = res.body.data;
      const reviewFound = await PropertyReview.find({_id: review_id,parent_property_id: id});
      expect(reviewFound).toBeDefined();
      newProperty = await Property.findById(id);
      expect(newProperty.overallRating).toBe(1.63);
      expect(newProperty.ratingBreakDown.awesome).toBe(0);
      expect(newProperty.ratingBreakDown.great).toBe(1);
      expect(newProperty.ratingBreakDown.good).toBe(0);
      expect(newProperty.ratingBreakDown.ok).toBe(0);
      expect(newProperty.ratingBreakDown.aweful).toBe(3);
      expect(newProperty.totalReviewCount).toBe(4);
    });


    it('35. voteUp - should pass and increase voteup var', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/${newProperty.id}/${rev1.id}`).send({
        vote:0
      })
      .expect(200);
      expect(res.body.data.voteDown).toEqual(1);
    });

    it('36. voteUp - should pass and increase voteup var', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/${newProperty.id}/${rev1.id}`).send({
        vote:1
      })
      .expect(200);
      expect(res.body.data.voteUp).toEqual(1);
    });

    it('37. voteUp - should not pass and throw error since property id invalid', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/asvzx/${rev1.id}`).send({
        vote:1
      })
      .expect(400);
      expect(res.body.message).toEqual("Invalid property id");
      expect(res.body.success).toEqual(false);
    });

    it('38. voteUp - should not pass and throw error since review id invalid', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/${newProperty.id}/zjkhdgfa`).send({
        vote:1
      })
      .expect(400);
      expect(res.body.message).toEqual("Invalid review id");
      expect(res.body.success).toEqual(false);
    });

    it('39. voteUp - should not pass and throw error since review not found', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/${newProperty.id}/6232084dd47c6b7840631e46`).send({
        vote:1
      })
      .expect(404);
    });

    it('40. voteUp - should not pass and throw error since property not found', async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'testsstreet',
          postalCode: 'N2L 3Y7'
        }
      });
      await newProperty.save();
      const rev1 = new PropertyReview({
        parent_property_id: newProperty.id,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();

      res = await request.patch(`/review/vote/6232084dd47c6b7840631e46/${rev1.id}`).send({
        vote:1
      })
      .expect(404);
    });


  });
  describe('1. Admin API tests',() =>{
    let refreshToken;
    let accessToken;

    beforeAll(async ()=>{
        await Property.deleteMany({});
        await PropertyReview.deleteMany({});
        await User.deleteMany({});
        const res = await createAdminUser();
        expect(res.status).toEqual(201);
      });

    beforeEach(async ()=>{
      let resAuth = await loginAdminUser();
      expect(resAuth.status).toEqual(200);
      accessToken = resAuth.body.data.token;
      refreshToken = resAuth.body.data.refreshToken;
    });

    afterEach(async ()=>{ 
        await Property.deleteMany({});
        await PropertyReview.deleteMany({});
        let resAuth = await loginAdminUser(refreshToken);
        expect(resAuth.status).toEqual(200);  
    });

    it('1. Reject a flagged review - should return 200 and delete flagged review from database',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 5,
        flagged: true,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      var review_id = rev1.id
      let decision = 'reject';
      const res2 = await request.post(`/admin/judge/review/${pid}/${review_id}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

      expect(res2.body.message).toBe("Successfully rejected review");
      expect(res2.body.data._id).toBe(review_id);
      expect(res2.body.success).toBe(true);

      const res3 = await request.get(`/review/${pid}/${review_id}`)
      .expect(404)
    });

    it('2. Reject a flagged review - should throw 400 if flagged review id is not valid',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 5,
        flagged: true,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      var review_id = rev1.id;
      let decision = 'reject';
      const res2 = await request.post(`/admin/judge/review/${pid}1/${review_id}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
      expect(res2.body.message).toBe("Invalid flag id");
    });

    it('3. Reject a flagged review - should throw 404 if cannot find flagged review',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 5,
        flagged: true,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      let decision = 'reject';
      const res2 = await request.post(`/admin/judge/review/${pid}/${pid}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
      expect(res2.body.message).toBe("Unable to find review");
    });

    it('4. Approve a flagged review - should return 200',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flagged: true,
        flags: 5,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      var review_id = rev1.id
      let decision = 'approve';
      const res2 = await request.post(`/admin/judge/review/${pid}/${review_id}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      expect(res2.body.message).toBe(`Successfully ${decision}ed review`);
      expect(res2.body.data._id).toBe(review_id);
      expect(res2.body.success).toBe(true);

      const res3 = await request.get(`/review/${pid}/${review_id}`)
      .expect(200)
    });

    it('5. Approve flagged review - should throw 404 if cannot find flagged review',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      var review_id = rev1.id
      let decision = 'approve';
      const res2 = await request.post(`/admin/judge/review/${pid}/${pid}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
      expect(res2.body.message).toBe("Unable to find review")
    });

    it('6. Approve for flagged review - should throw 400 if id is invalid',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      let decision = 'approve';
      var review_id = rev1.id
      const res2 = await request.post(`/admin/judge/review/${pid}/${review_id}1?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400)
      expect(res2.body.message).toBe("Invalid flag id");
    });

    it('7. Fetch all new properties - should return 200',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      const newProperty2 = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty2.save();
      var pid = newProperty.id;

      const res2 = await request.get(`/admin/properties`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      expect(res2.body.message).toBe("Successfully fetched all properties that are not approved");
      expect(res2.body.data.length).toBe(2);
    });

    it('8. Fetch all flagged reviews - should return 200',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;

      const rev1 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 5,
        flagged: true,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev1.save();
      var review_id = rev1.id

      const rev2 = new PropertyReview({
        parent_property_id: pid,
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 5,
        flagged: true,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await rev2.save();
      var review_id2 = rev2.id
      const res2 = await request.get(`/admin/reviews`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      expect(res2.body.message).toBe("Successfully fetched all flagged reviews");
      expect(res2.body.data.length).toBe(2);
    });

    it('9. Approve new properties - should return 200',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      let pid = newProperty.id;
      const decision = 'approve'; 
      const res2 = await request.post(`/admin/judge/property/${pid}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      expect(res2.body.message).toBe(`Successfully ${decision}ed property with given id`);
      expect(res2.body.data.approval).toBe(true);
    });

    it('10. Approve new properties - should throw 400 if id invalid',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      let pid = newProperty.id;
      const decision = 'approve'; 
      const res2 = await request.post(`/admin/judge/property/${pid}1?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400)
      expect(res2.body.message).toBe("Invalid property id")
      expect(res2.body.success).toBe(false)
    });

    it('11. Approve new properties - should throw 404 if cannot find',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;
      const decision = 'approve';
      const invalid_id ="5e63c3a5e4232e4cd0274ac2";
      const res2 = await request.post(`/admin/judge/property/${invalid_id}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
      expect(res2.body.message).toBe("Property not found")
      expect(res2.body.success).toBe(false)
    });

    it('12. Reject new properties - should return 200',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;
      const decision = 'reject';
      const res2 = await request.post(`/admin/judge/property/${pid}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      expect(res2.body.message).toBe(`Successfully ${decision}ed property with given id`);
      expect(res2.body.success).toBe(true);

    });

    it('13. Approve new properties - should throw 400 if id invalid',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      var pid = newProperty.id;
      const decision = 'approve';
      const res2 = await request.post(`/admin/judge/property/${pid}1?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
      expect(res2.body.message).toBe("Invalid property id");
      expect(res2.body.success).toBe(false);
    });

    it('14. Approve new properties - should throw 404 if cannot find',async function() {
      const newProperty = new Property({
        propertyType: 'Condo',
        address: {
          state: 'On',
          city: 'Waterloo',
          street: 'teststreet',
          postalCode: 'N2L 3Y7'
        },
      });
      await newProperty.save();
      const decision = 'approve';
      const invalid_id = "5e63c3a5e4232e4cd0274ac2"
      const res2 = await request.post(`/admin/judge/property/${invalid_id}?decision=${decision}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
      expect(res2.body.message).toBe("Property not found");
      expect(res2.body.success).toBe(false);
    });

  });

  describe('1. Search tests',() =>{
    beforeAll(async ()=>{
        await Property.deleteMany({});
      });

    afterEach(async ()=>{
        await Property.deleteMany({});
    });

    it('1. Search for properties - no string',async function() {
        const searchString = "";
        const res = await request.get(`/search?q=${searchString}`)
        .expect(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.message).toBe("success");
        expect(res.body.success).toBe(true);
    });

    it('2. Search for properties - search matching keyword',async function() {

      const searchString = "Columbia Street";
      const properties = [
        new Property({
        propertyType: 'Apartment',
        address: {
          state: 'Ontario',
          city: 'Waterloo',
          street: 'Columbia Street',
          postalCode: 'N2P 3Y7'
        }
      }),
      new Property({
        propertyType: 'Condo',
        address: {
          state: 'British Columbia',
          city: 'Laurel',
          street: '140 teststreet st',
          postalCode: 'N2Q 3Y7'
        }
      }),
      new Property({
        propertyType: 'Villa',
        address: {
          state: 'NovaScotia',
          city: 'Scotland',
          street: '120 test1street ave',
          postalCode: 'N2V 3Y7'
        }
      }),
      new Property({
        propertyType: 'Hut',
        address: {
          state: 'Ontario',
          city: 'London',
          street: '20 Maple Street',
          postalCode: 'N2A 3Y7'
        }
      })
    ]
      await Property.collection.insertMany(properties);
      const res = await request.get(`/search?q=${searchString}`)
      .expect(200);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.message).toBe("success");
      expect(res.body.success).toBe(true);
    });

  it('3. Search for properties - check if all required fields are being sent',async function() {

    const searchString = "Columbia Street";
    const properties = [
        new Property({
        propertyType: 'Apartment',
        address: {
          state: 'Ontario',
          city: 'Waterloo',
          street: 'Columbia Street',
          postalCode: 'N2P 3Y7'
        }
      }),
      new Property({
        propertyType: 'Condo',
        address: {
          state: 'British Columbia',
          city: 'Laurel',
          street: '140 teststreet st',
          postalCode: 'N2Q 3Y7',
          reviews:[],
          pictures:[],
          overallRating: 3.0
        }
      }),
      new Property({
        propertyType: 'Villa',
        address: {
          state: 'NovaScotia',
          city: 'Scotland',
          street: '120 test1street ave',
          postalCode: 'N2V 3Y7',
          reviews:[],
          pictures:[],
          overallRating: 4.0
        }
      }),
      new Property({
        propertyType: 'Hut',
        address: {
          state: 'Ontario',
          city: 'London',
          street: '20 Maple Street',
          postalCode: 'N2A 3Y7'
        },
        reviews:[],
        pictures:[],
        overallRating: 5.0
      })
      ]
      await Property.collection.insertMany(properties);
      const res = await request.get(`/search?q=${searchString}`)
      .expect(200);

      expect(res.body.data[0].address,).toEqual(expect.anything());
      expect(res.body.data[0].propertyType).toEqual(expect.anything());
      expect(res.body.data[0].overallRating).toEqual(expect.anything());
      expect(res.body.data[0]._id).toEqual(expect.anything());
      expect(res.body.data[0].pictures).toEqual(expect.anything());
      expect(res.body.message).toBe("success");
      expect(res.body.success).toBe(true);
    });

  });

  describe('flag API test', () => {
    it('1. Flag a review test - should get 200 and increase flags by 1 each time', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:1,
        crowdedness: 2,
        cleanliness: 3,
        accessibility: 4,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[]
      });
      await newReview.save();
      for(let i =1;i<=3;++i){
        const res = await request.put(`/flag/${newReview.parent_property_id}/${newReview.id}`)
        .expect(200);
        expect(res.body.message).toBe("Successfully flagged review");
        expect(res.body.success).toBe(true);
        const reviewFound = await PropertyReview.findOne({_id: newReview.id, parent_property_id: newReview.parent_property_id});
        expect(reviewFound.flags).toBe(i);
      }
    });

    it('2. Update flagged review test - should get 400 because of invalid id', async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:2,
        crowdedness: 1,
        cleanliness: 3,
        accessibility: 2,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await newReview.save();
      const res = await request.put(`/flag/${newReview.parent_property_id}1/${newReview.id}`)
      .expect(400);
      expect(res.body.message).toBe("Invalid flagged review id");
      expect(res.body.success).toBe(false);
    });

    it('3. Update flagged review test - should get 404 because of not being able to find the review' , async function() {
      const newReview = new PropertyReview({
        parent_property_id: '621d870287931fa3c89a5508',
        bedNum:1,
        bathNum: 1,
        landlordData : "im landlord",
        costReview: 1000,
        overallRatingReview: 5,
        landlordRating:2,
        neighborhood:false,
        crowdedness: true,
        cleanliness: false,
        accessibility: true,
        textReview: "this is textReview",
        voteUp:0,
        voteDown:0,
        flags: 0,
        datePosted:"2021-1-1",
        pictures:[],
      });
      await newReview.save();
      const res = await request.put(`/flag/${newReview.parent_property_id}/${newReview.parent_property_id}`)
      .expect(404);
      expect(res.body.message).toBe("Unable to find review");
      expect(res.body.success).toBe(false);
    });

  });
});
