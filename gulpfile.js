
const gulp = require('gulp');
//sass to css
const sass = require('gulp-sass')(require('sass'));
//optimize the css code and to small the code
const cssnano = require('gulp-cssnano');
//adding hash to the file name
const rev = require('gulp-rev');

const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');

// const del = require('del');

gulp.task('css', (done) => {
    console.log('Minifying CSS');
    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('../assets.css'));
    console.log('Minified CSS');
    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        })).pipe(
            gulp.dest('./public/assets')
        );
    done();
});
gulp.task('js', (done) => {
    console.log('Minifying JS');
    gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(
            gulp.dest('./public/assets')
        );
    done();
});

gulp.task('images', function (done) {
    console.log('compressing images....');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
});


//empty the public/assets directory
gulp.task('clean:assets', function(done){
    // del.deleteSync(['./public/assets'], { force:true });
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('building assets');
    done();
});
