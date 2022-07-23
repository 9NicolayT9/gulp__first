// Подключение модулей
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Пути сохранения
const paths = {
    styles: {
        src: 'src/Styles/**/*.sass',
        dest: 'dist/styles/'
    },
    scripts: {
        src: 'src/Scripts/**/*.js',
        dest: 'dist/scripts/'
    }
}

// Очистка готовой папки
function clean() {
    return del(['dist'])
}

// Компилятор стилей
function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

// Компилятор скриптов
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

// Автоматический просмотр изменений
function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Операции сборки
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.default = build