// add_review?keyword=62425387347f5758cf87be3e
describe("renders the add a review page for 1 listing", () => {
    it("renders correctly", () => {
        cy.visit("/add_review?keyword=62425387347f5758cf87be3e")
    })
    it("contains Overall Rating", () => {
        cy.get('div').contains("Overall Rating")
    })
    it("contains Landlord Rating", () => {
        cy.get('div').contains("Landlord Rating")
    })
    it("contains Neighborhood", () => {
        cy.get('div').contains("Neighborhood")
    })
    it("contains Crowdedness", () => {
        cy.get('div').contains("Crowdedness")
    })
    it("contains Cleanliness", () => {
        cy.get('div').contains("Cleanliness")
    })
    it("contains Accessibility", () => {
        cy.get('div').contains("Accessibility")
    })
    it("contains Cost per Month (CAD)", () => {
        cy.get('div').contains("Cost per Month (CAD)")
    })
    it("contains Beds", () => {
        cy.get('div').contains("Beds")
    })
    it("contains Baths", () => {
        cy.get('div').contains("Baths")
    })
    it("contains Detailed Review", () => {
        cy.get('div').contains("Detailed Review")
    })
    it("contains Submit", () => {
        cy.get('div').contains("Submit")
    })
})