docker run --rm --volume prototype_mongo-data:/db --volume $(pwd):/backup ubuntu tar cvf /backup/db.tar /db
cp -R ../backend/public ./public
