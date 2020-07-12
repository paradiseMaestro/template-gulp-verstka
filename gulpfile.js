const { src, dest, parallel, series, watch } = require('gulp');
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
var gcmq = require('gulp-group-css-media-queries');

function main() {
    return src('scss/main.scss')
    .pipe(sass())
    .pipe(gcmq())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(dest('css'))
    .pipe(browserSync.stream())
}

gulp.task('browser-sync', async function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

function scripts() {
    return src([
        'js_mod/jquery/*',
        'js_mod/header_footer/*',
        'js_mod/ovl-slider/*',
        'js_mod/main.js']
        )
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(dest('js'))
	.pipe(browserSync.stream())
}
gulp.task('code', function() {
    return gulp.src('/*.html')
    .pipe(browserSync.reload({ stream: true }))
});


        

        

        







    function startwatch() { 
        watch(['scss' + '/**/*','scss/main.scss'], main);
        watch('js_mod/**/*.js', scripts);
        watch('app/*.html', parallel('code')); 
     }

exports.assets      = series(main, scripts);
exports.scripts     = series(scripts);
exports.default     = parallel(startwatch,main,scripts);
exports.styles      = parallel(main);
