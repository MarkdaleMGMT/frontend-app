### src/pages/SignIn

In SignIn page, collects user's info. of username & password, make use of Frontend API to log in. Before submitting, validate username & password. They cannot be empty. If error, show prompts. After submitting, if error, show error message. if success, redirect to dashboard page and show user's referrel code in sidebar menu.

### src/pages/SingUp

In SignUp page, collects user's info, make use of Frontend API to sign up. Before submitting, validate each item. If error, show prompts. After submitting, if error, show error message. if success, redirect to SignIn page.

### src/pages/ForgotPassword

In Forgotpassword page, collects user's email address, make use of Frontend API to reset password. Before submitting, validate email address. If error, show prompts. After submitting, if error, show error message. if success, show successful message.

### src/pages/Dashboard

In Dashboard page, pass the referral code to Leftsidebar using props and set session logout time to 6 seconds (just for test). When time is up, redirect to root path.


-Changed Login to sign in, took about 3 min
-spent about an hour trying to get into dashboard without having ref number
-once had ref number and made an account, changed line chart time days to 60 instead of 180 and added the ability to see linechart after 120 days. Took about 7 min to find the code and play around with.
-changed padding in Table.sccs, .Table_pagination to 50 so doesn't block the Description and Amount, approx 10 min to find class name and play around with