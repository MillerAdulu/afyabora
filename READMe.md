# Afya Bora API

## Introduction
This was made at a Hackathon from the 19th - 21st of October 2018 held at Life Ministries Nairobi. This is the API for the mobile application available at [Afya Bora App](https://github.com/MillerAdulu/afyaboraapp). This was made by the Afya Bora team. This particular repository is adapted from the repository that was used available at [IHack](https://github.com/EdwinWalela/ihack) with minor changes in the code base while retaining the same functionality.

## Setup

1. Clone this repository
2. Run `yarn install` or `npm install`
3. Rename the `.env.example` file to `.env`
4. Set a Mongo DB URI
5. Obtain an email API key from [SendGrid](https://sendgrid.com/)
6. Generate an encryption string from [Secure Password Generator](https://passwordsgenerator.net/)
7. Set the Base URL of where the application will be hosted. This is important for email sending. eg. `https://mail.com` **not** `mail.com` or `https://mail.com/`. HTTPS is preferred.
8. Run `yarn build` and `yarn start` :tada:

## Conclusion

The project uses the `eslint-config-airbnb-base` and `eslint-plugin-import` global packages for linting.

Pull requests are welcome.