describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    // it("send request", () =>{
    //     cy.request({
    //         header: "Access-Control-Allow-Origin: *",
    //         method: 'POST',
    //         url: `${process.env.SERVER_URL}/auth/login`,
    //         body: {
    //             email: "john@test.com",
    //             password: "john123"
    //         },
    //       })
    //       .then(function (response) {
    //         console.log(response);
    //       })
    // })
    it("contains Login button", () => {
        cy.get('form').contains("Login").click()
    })
    
    
describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    it("contains Register", () => {
        cy.get('form').contains("Register").click()
    }) 
})

describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    it("contains Remember me", () => {
        cy.get('form').contains("Remember me").click()
    })
})

describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    it("contains forgot password field", () => {
        cy.get('form').contains("Forgot password?").click()
    })
})


describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    it("contains Register", () => {
        cy.get('form').contains("Register").click()
    }) 
})

describe("renders the login page", () => {
    it("renders correctly", () => {
        cy.visit("/login")
    })
    it("contains Remember me", () => {
        cy.get('form').contains("Remember me").click()
    })
})
    
})
