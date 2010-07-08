SRC_DIR = public/javascripts
BUILD_DIR = build

JS_SRC_FILES = \
	${SRC_DIR}/src/{main,utils,search,navigation,sorting,ordering,context_menu,localization}.js

zip:
	@rm -fr ${SRC_DIR}/flexirails.js

	@echo "building js..."
	@cat ${SRC_DIR}/src/misc/head.txt ${JS_SRC_FILES} ${SRC_DIR}/src/misc/foot.txt > ${SRC_DIR}/flexirails.js

	@echo "compressing js..."
	@java -jar ${BUILD_DIR}/compiler.jar --js ${SRC_DIR}/flexirails.js \
  > ${SRC_DIR}/flexirails.min.js