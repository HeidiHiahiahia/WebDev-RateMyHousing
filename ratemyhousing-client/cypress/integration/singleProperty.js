// http://localhost:3000/property?keyword=62425387347f5758cf87be3e
describe("renders the property detail page for 1 listing", () => {
    it("renders correctly", () => {
        cy.visit("/property?keyword=62425387347f5758cf87be3e")
    })
    it("contains Address ", () => {
        cy.get('div').contains("Address")
    })
    it("contains Property Type", () => {
        cy.get('div').contains("Property Type")
    })
    it("contains Overall rating", () => {
        cy.get('div').contains("Overall rating:")
    })
    it("contains Rating Distribution", () => {
        cy.get('div').contains("Rating Distribution")
    })
    it("contains Amenities list", () => {
        cy.get('div').contains("Amenities list")
    })
    it("contains Submit a review", () => {
        cy.get('div').contains("Submit a review").click()
    })
})