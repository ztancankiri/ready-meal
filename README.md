# ReadyMeal Prototype

ReadyMeal is an online platform to help restaurant customers reserve a table in a restaurant and reduce their waiting time for meal preparation with a vast selection of available meals prepared in advance for their reservations.

# How to run!

There are two ways to run ReadyMeal services on your local environment.

1. Running using docker (Highly Suggested Way!)
2. Running via runner.sh script.

ReadyMeal services are composed of 4 main components as follows:

1. Backend Server
2. Frontend Static Server
3. MongoDB Instance
4. Stripe-CLI

The Stripe-CLI should be downloaded for ReadyMeal to handle payments from the website.
The requests are redirected from our program by this CLI tool to Stripe and the responses from the Stripe is collected by this tool to verify payment status of customers. It can be downloaded from this link according to the system you use:
https://stripe.com/docs/stripe-cli

The MongoDB 6.0 should be used to run ReadyMeal smoothly. How to download or upgrade your MongoDB is in the following link:

https://www.mongodb.com/try/download/community

# Notes on Docker usage:

1. Run the "docker-compose up -d" in the main directory of the page.
2. After creating the volumes, please don't move the project files to another directory since the volumes are bind to that path during creation

# Dumps

To try out the program, you can use the dumps we added in the main directory. You should import them one by one to localhost:7777/dev/mongo however the restaurant owner and customer users have some problems in the dumps. You should try out the program from the scratch if you want the full functionality.
