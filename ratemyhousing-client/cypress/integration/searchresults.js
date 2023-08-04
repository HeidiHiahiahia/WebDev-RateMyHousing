describe("renders the search_results page", () => {
    it("renders correctly", () => {
        cy.visit("/search")
    })
    it("contains Add a new property", () => {
        cy.get('div').contains("Add a new property")
    }) 

}) 