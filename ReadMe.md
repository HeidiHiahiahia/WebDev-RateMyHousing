
![RMP Logo](RMP_Logo.png)

# About

Rate my property is a website that provides a platform for users to anonymously review and rate their housings (rentals, properties, etc.). This will serve as centralized information center for tenants and property buyers to seek factual recommendations/suggestions about potential rentals and help in their decision-making process.

The ability to anonymously post reviews will encourage candid and more genuine feedback. On current housing websites, the properties are posted by the owners.

The information sometimes can be incomplete and deceiving, which may mislead tenants and buyers. Our objective is to offer valuable guidance from people who have lived in a particular house or neighborhood to the ones seeking a home in the same house or similar neighborhood.The solution will be developed in a decoupled architecture. Such an approach also allows for development of various frontend applications.

## Why RateMyProperty ?

Currently existing similar websites only provide the way to connect property owners to the buyers and renters but Rate my property helps them gain insights about the property from previous users themselves. These insights are helpful in terms of providing information. The review and the rating of the property assists tenantsand buyersin making decision about rentingor buying a property.


# Tech

![Simple Arch Diagram](arch_diagram.png)

## Backend

The backend is developed using Node-JS express framework. For the database,NoSQL (MongoDB) is used for storing data. Unit tests are done using jest and supertest.

## Frontend

The frontend application is developed using Reactjs. The react application will be able to consume APIs and connect to the backend. These apps are built to be deployed using AWS EC2 and S3 (Current S3 image storage feature is not functional).

# Latest Update

This application has been containerized, to run this application install docker and run the script 'startRMH.sh' as shown below. It's gonna take a while to build the first time. Once installed, it will launch quickly. Also be mindful of the space as it runs in 3 containers ( approx 2.5GB )

1. ```chmod +x rs-init.sh``` <br>
2. ```chmod +x startRMH.sh``` <br>
3. ```./startRMH```


In case of any trouble running the script try this command on the script. (The script was written in Windows and due to that windows adds a extra character at EOL which posix based systems do not do)

```sed -i -e 's/\r$//' scriptname.sh```

Reference: https://stackoverflow.com/questions/14219092/bash-script-and-bin-bashm-bad-interpreter-no-such-file-or-directory


# Screenshots

Home Page
![HomePage](screenshots/HomePage.png)

Search Results
![SearchResults](screenshots/Search%20Results.png)

Add Property Form
![AddProperty](screenshots/Add%20Property%20Form.png)

Property Page
![PropInfo](screenshots/PropertyInfo.png)

Reviews
![Reviews](screenshots/Reviews%20Page.png)

Admin Home Page
![Admin Access](screenshots/HomePage%20Admin.png)

Admin Control
![Admin Access](screenshots/Admin%20Control.png)

Sign Up Page
![SignUp](screenshots/SignUp%20Page.png)
