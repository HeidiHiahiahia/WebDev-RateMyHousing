describe("renders the homepage", () => {
    it("renders correctly", () => {
        cy.visit("/")
    })
    it("contains HOME component", () => {
        cy.get('header').contains("HOME").click()
    })
    it("contains Account component", () => {
        cy.get('header').contains("LOGIN").click()
    })
    it("contains Account component", () => {
        cy.get('header').contains("NEW PROPERTY").click()
    })
})

