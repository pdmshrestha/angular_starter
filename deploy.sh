# This make final file ready for uglify due to module injection,
grunt ngAnnotate

# uglify the generated
grunt uglify

# copy necessary files to dist folder
grunt copy