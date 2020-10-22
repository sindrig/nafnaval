build:
	./build_backend
	./build_frontend

clean:
	rm -rf dist

deploy: clean build
	./deploy

test-env:
	./set-up-test-env.sh