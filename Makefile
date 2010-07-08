SRC_DIR = src
BUILD_DIR = build
BIN_DIR = bin

JS_SRC_FILES = \
	${SRC_DIR}/{main,utils,search,navigation,sorting,ordering,context_menu,localization}.js

create:
	@rm -fr ${BUILD_DIR}
	@mkdir ${BUILD_DIR}

	@echo "building js..."
	@cat ${SRC_DIR}/misc/head.txt ${JS_SRC_FILES} ${SRC_DIR}/misc/foot.txt > ${BUILD_DIR}/flexirails.js

	@echo "compressing js..."
	@java -jar ${BIN_DIR}/compiler.jar --js ${BUILD_DIR}/flexirails.js \
  > ${BUILD_DIR}/flexirails.min.js