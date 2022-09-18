$(() => {
    // 相似电影推荐按钮效果
    $(".page-main .clip").empty();
    $(".page-main .clip").append('<b class="close">Close</b>');
    $(".game-profile-price button").click(() => {
        $(".game-profile-price button").addClass("active");
        $(".clip").addClass("active");
    });
    $(".clip .close").click(() => {
        $(".game-profile-price button").removeClass("active");
        $(".clip").removeClass("active");
    });

    // 获取电影信息
    $.get(window.globalConfig.baseUrl + "/movie_profile", (data) => {
        var movieName = data.NAME;
        var movieActors = data.ACTORS;
        var movieDirectors = data.DIRECTORS;
        var movieGenres = data.GENRES === null ? "" : data.GENRES.join(" / ");
        var movieStoryline = data.STORYLINE;
        var movieTags = data.TAGS === null ? [] : data.TAGS;
        var movieRating =
            data.AVERAGE_RATING === null
                ? "-.-"
                : Math.round(data.AVERAGE_RATING * 10) / 10;
        var movieCover = data.R === null ? "/assets/img/no-cover.jpg" : data.R;
        var movieImages =
            data.S === null ? ["/assets/img/no-image.jpg"] : data.S;
        $(".page-main ul li:eq(1) span").text(movieName);
        $(".page-main h3.uk-text-lead").text(movieName);
        $(".page-main .gallery .swiper-wrapper").empty();
        for (var i = 0; i < movieImages.length; i++) {
            $(".page-main .gallery .swiper-wrapper").append(
                '<div class="swiper-slide"><img src="' +
                    movieImages[i] +
                    '" alt="' +
                    movieName +
                    '"></div>'
            );
        }
        $(".page-main .game-profile-card .game-profile-card__media img").attr({
            src: movieCover,
            alt: movieName,
        });
        $(".page-main .game-profile-card .game-profile-card__intro span").text(
            movieStoryline
        );
        $(
            ".page-main .game-profile-card .game-profile-card__list .game-card__rating span"
        ).text(movieRating);
        $(
            ".page-main .game-profile-card .game-profile-card__list li:eq(1) div:eq(1)"
        ).text(movieDirectors);
        $(
            ".page-main .game-profile-card .game-profile-card__list li:eq(2) div:eq(1)"
        ).text(movieActors);
        $(
            ".page-main .game-profile-card .game-profile-card__list li:eq(3) div:eq(1)"
        ).text(movieGenres);
        $(".page-main .game-profile-card .game-profile-card__type").empty();
        for (var i = 0; i < movieTags.length; i++) {
            $(".page-main .game-profile-card .game-profile-card__type").append(
                "<li><span>" + movieTags[i] + "</span></li>"
            );
        }
    });

    // 相似电影推荐
    var LoadMovies = (data) => {
        for (var i = 0; i < 12 && i < data.length; i++) {
            var movieId = data[i].MOVIE_ID;
            var movieName = data[i].NAME;
            var movieGenres =
                data[i].GENRES === null ? "" : data[i].GENRES.join(" / ");
            var movieRating =
                data[i].AVERAGE_RATING === null
                    ? "-.-"
                    : Math.round(data[i].AVERAGE_RATING * 10) / 10;
            var movieCover =
                data[i].R === null ? "assets/img/no-cover.jpg" : data[i].R;
            $(".page-main .clip").append(
                '<div class="movies">' +
                    '<div class="game-card">' +
                    '<div class="game-card__box">' +
                    '<div class="game-card__media">' +
                    '<a href="javascript:void(0);" movie_id="' +
                    movieId +
                    '" onclick="postMovieId(this)">' +
                    '<img src="' +
                    movieCover +
                    '" alt="' +
                    movieName +
                    '" />' +
                    "</a>" +
                    "</div>" +
                    '<div class="game-card__info">' +
                    '<a class="game-card__title" href="javascript:void(0);" movie_id="' +
                    movieId +
                    '" onclick="postMovieId(this)">' +
                    movieName +
                    "</a>" +
                    '<div class="game-card__genre">' +
                    movieGenres +
                    "</div>" +
                    '<div class="game-card__rating-and-price">' +
                    '<div class="game-card__rating">' +
                    "<span>" +
                    movieRating +
                    "</span>" +
                    '<ion-icon name="star" class="star"></ion-icon>' +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            );
        }
    };
    $.post(
        window.globalConfig.baseUrl + "/recommend",
        {
            recommendedBy: "MovieProfile",
        },
        (data) => {
            LoadMovies(data);
        }
    );
});
