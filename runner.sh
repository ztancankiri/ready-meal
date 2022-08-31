# ===[ ENV VARIABLES ]===
export ROOT_DIR=$(pwd)

export PORT=7777
export PATH_PREFIX=/api/v1

export MONGODB_URI=mongodb://localhost:27017/readymeal?authSource=admin

export STRIPE_SECRET_KEY=sk_test_51L6bNyKMyjc8JMla08lBboCprt3VxWJFz0ZyNWICpvpb0hDWFlLL2wqBv2JQMlba0tX0Wv3IE6oBE4ccPRsidWFk005uWqvKeA
export STRIPE_ENDPOINT_SECRET=whsec_95eb23ca56cef36a947bb50d59e50260776d013d61b83e01a1572022edbd2c0d
export STRIPE_SUCCESS_ENDPOINT=http://localhost:$PORT$PATH_PREFIX?session_id={CHECKOUT_SESSION_ID}
export STRIPE_CANCEL_ENDPOINT=http://localhost:$PORT$PATH_PREFIX?session_id={CHECKOUT_SESSION_ID}
export STRIPE_DEVICE_NAME=readymeal
export STRIPE_WEBHOOK_URL=http://localhost:$PORT$PATH_PREFIX/payment/webhook

export MAIL_SERVICE=gmail
export MAIL_USERNAME=info.readymeal@gmail.com
export MAIL_PASSWORD=givwsxkslydaeozc
export MAIL_FROM=ReadyMeal

export AUTH_TOKEN_EXPIRE_TIME=86400000
export JWT_SECRET=verysecretsecret

export PUBLIC_RESTAURANT_DIRECTORY=public/resources/restaurant
export PUBLIC_FOOD_DIRECTORY=public/resources/food

# ===[ Stripe ]===
stripe listen --api-key $STRIPE_SECRET_KEY --device-name $STRIPE_DEVICE_NAME --forward-to $STRIPE_WEBHOOK_URL &

# ===[ BACKEND ]===
cd $ROOT_DIR/backend
npm run prod &

# ===[ FRONTEND ]===
cd $ROOT_DIR/frontend
npm run prod &