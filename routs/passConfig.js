const localStratgy = require("passport-local").Strategy

authenticateUser = function() {

}

function initialize(passport) {
    const authenticateUser = (email, password, dune) => {

    }
    passport.use(new localStratgy({ usernameField: "user_name" }), authenticateUser)
}