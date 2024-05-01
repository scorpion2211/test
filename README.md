# DevsuTest

This project was generated with `Angular CLI` version 15.2.11 and `node version` 20.11.0

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `npm run build:prod` to build the project for production. The build artifacts will be stored in the `dist/` directory.

## Commits

Rules are added to the commit to be approved. You must complicate with the configuration that was added to the ESLint project and then the code will be preformatted automatically using Prettier. The validation will allow the warnings to pass.

## Add product

Only images from a url will be allowed
url used for product image: `https://www.pngkey.com/png/full/299-2993445_manufacturing-products-product-icon-png-white.png`

## Notes

- The exercise will not clarify whether the names of the products can be repeated, so said repetition will be assumed valid.
- The product search was not specified by which field it should be taken so it will be assumed that it will only search by the product name.
- It is not specified if the ID can be editable, so the user will be allowed to change it, but when submitting the form it will be validated whether it exists or not. If it does not exist, the user will be informed and no data will be updated or a new product added.
- FontAwesome icon library is incorporated and a random image from the internet of a box is loaded to represent the product, so the internet was required to run the project.
