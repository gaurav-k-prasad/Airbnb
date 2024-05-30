Form validation -> Whenever we enter any data the browser/web server will check if the data is valid/correct format or not
and within the constraints provided.

---

### 2 ways to do so -

1. By client side checks by required/max/min in input tags
2. By server side checks in schema

### If you don't want default error message on invalid inputs in forms

Then we can use bootstrap form validation just add _novalidate_ in form so that error message does not come and class needs-validation in form and paste a js code in public js file
https://getbootstrap.com/docs/5.0/forms/validation/#custom-styles

### ejsMate is npm package which is used to embed a boilerplate in every ejs file

Look at ./views/layouts/boilerplate for syntax as <%- body %> and in any listing files for <%- layout("...path") %>


### joi is npm package used to validate schema of mongodb so if any required params missing then throw error
by Joi we declare a schema for joi used for validating


### passport -> npm package used for authentication from various sources
### passport-local -> npm package used for authentication from username, password

### passport-local-mongoose -> npm package used for easier integration with mongodb
While writing schema for user we can use Schama.plugin(passportLocalMongoose);