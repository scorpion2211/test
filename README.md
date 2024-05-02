# DevsuTest

This project was generated with `Angular CLI` version 15.2.11 and `node version` 20.11.0

## Install dependencies

- Run the `npm i` command
- If the `npm i` command ends with errors please run it again or run `npm run reinstall` from a linux terminal
- If you want, you can run `npm run clean` to clean the npm cache and libraries. At the end run `npm i` again

## Development server

- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
- A button is added in the lower left corner with options to empty and load the list

## Commits

Rules are added to the commit to be approved. You must complicate with the configuration that was added to the ESLint project and then the code will be preformatted automatically using Prettier. The validation will allow the warnings to pass.

## Add product

- Only images from a url will be allowed.
- Image url used for product registration: `https://raw.githubusercontent.com/scorpion2211/test/master/src/assets/images/box.png`

## Notes

- Navigation buttons are added to the upload/edit form to facilitate user experience and site testing
- Added "view" action along with "edit" and "delete" because the description and names may be too long to be displayed in the table
- The exercise will not clarify whether the names of the products can be repeated, so said repetition will be assumed valid.
- The product search was not specified by which field it should be taken so it will be assumed that it will only search by the product name.
- It is not specified if the ID can be editable, so the user will not be able to change it. In this way, the problem of if the user changes the ID for that of another product is avoided, which would cause a product to be stepped on and duplicated, losing the previous one.era una simple ppregunta
- FontAwesome icon library is incorporated and a random image from the internet of a box is loaded to represent the product, so the internet was required to run the project.

## Build

- Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
- Run `npm run build:prod` to build the project for production. The build artifacts will be stored in the `dist/` directory.

## Test

For some reason that I did not manage to adjust, if running the tests gives an error, download the tests and run them again or comment on it('should navigate to "/product/add" and return false if editable product is null' ) from the ProductGuard test.
