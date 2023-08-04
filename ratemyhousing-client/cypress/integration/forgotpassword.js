describe("renders the forgot password page", () => {
    it("renders correctly", () => {
        cy.visit("/resetPassword")
    })
    it("contains Reset Password", () => {
        cy.get('form').contains("Reset Password").click()
    }) 

    describe("renders the forgot password page", () => {
        it("renders correctly", () => {
            cy.visit("/resetPassword")
        })
        it("already user has a login", () => {
            cy.get('div').contains("Already have an account? Login!").click()
        }) 
    })

    describe("renders the forgot password page", () => {
        it("renders correctly", () => {
            cy.visit("/resetPassword")
        })
        it("user wants to create account", () => {
            cy.get('form').contains("Create an Account!").click()
        }) 
    })
})