# Calculator

This project is to calculate Employees' annual contribution to their FSA account based on their amount per paycheck and pay period left.

I am using reactive form and subscribing to date and amount per paycheck fields then using the value combined to calculate the result.

To update the calculator with latest commit date or maximum annual amount, simplely update the commitDate.json file in assets folder(please follow the {name: "", amount, ""} format for maximum annual amounts), and remember to update min/max date for calendar picker as well, no need to re-compile the Angular app.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
