describe("renders the Sign up page", () => {
    it("renders correctly", () => {
        cy.visit("/register")
    })
    it("contains Sign up button", () => {
        cy.get('div').contains("Sign up").click()
    })
})