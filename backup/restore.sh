docker run --rm --volume prototype_mongo-data:/db --volume $(pwd):/backup ubuntu /bin/bash -c "rm -rf /db/* && tar xvf /backup/db.tar -C /db --strip 1"
rm -rf ../backend/public
cp -R ./public ../backend/public
