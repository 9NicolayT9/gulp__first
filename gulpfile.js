// Подключение модулей
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();

// Пути сохранения
const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: 'src/Styles/**/*.sass',
        dest: 'dist/Styles/'
    },
    scripts: {
        src: 'src/Scripts/**/*.js',
        dest: 'dist/Scripts/'
    },
    img: {
        src: 'src/Photos/*',
        dest: 'dist/Photos/',
    }
}

// Очистка готовой папки
function clean() {
    return del(['dist/*', '!dist/Photos'])
}

// Компилятор HTML
function html() {
    return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest((paths.html.dest)))
    .pipe(browsersync.stream())
}

// Компилятор стилей
function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCss({
        level: 2
    }))
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

// Компилятор скриптов
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}


// Сжатие картинок
function img() {
    return gulp.src(paths.img.src)
    .pipe(newer(paths.img.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(paths.img.dest))
}

// Автоматический просмотр изменений
function watch() {
    browsersync.init({
        server: {
            baseDir: './src/'
        }
    })
    gulp.watch(paths.html.src).on('change', browsersync.reload())
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Операции сборки
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.html = html
exports.img = img
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.default = build