var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync');
cache = require('gulp-cache');

gulp.task('scss', function () {
  // Создаем таск "sass"
  return (
    gulp
      .src('app/scss/main.scss') // Берем источник
      .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
      // .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
      .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
      .pipe(browserSync.reload({ stream: true }))
  ); // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () {
  // Создаем таск browser-sync
  browserSync({
    // Выполняем browser Sync
    server: {
      // Определяем параметры сервера
      baseDir: 'app', // Директория для сервера - app
    },
    notify: false, // Отключаем уведомления
  });
});

// gulp.task('scripts', function () {
//   return gulp
//     .src(['app/js/common.js', 'app/libs/**/*.js'])
//     .pipe(browserSync.reload({ stream: true }));
// });

gulp.task('code', function () {
  return gulp.src('app/*.html').pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
  // gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
});

gulp.task('prebuild', async function () {
  var buildCss = gulp
    .src([
      // Переносим библиотеки в продакшен
      'app/css/main.css',
      // 'app/css/libs.min.css',
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp
    .src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp
    .src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp
    .src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('default', gulp.parallel('scss', 'browser-sync', 'watch'));
gulp.task('build', gulp.series('clear', 'prebuild', 'scss'));
