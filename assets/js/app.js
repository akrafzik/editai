window.addEventListener('load', function() {
    var lock = new Auth0Lock('DwpE477F4CL4zEP6Kdj5MO6KS0fIPp6x', 'editai.auth0.com');
    var btn_login = document.getElementById('bt-login');
    var btn_logout = document.getElementById('bt-logout');

    if (btn_logout) {
        btn_logout.addEventListener('click', function() {
            logout();
        });
    }

    if (btn_login) {
        btn_login.addEventListener('click', function() {
            var id_token = localStorage.getItem('id_token');
            if (id_token) {
                window.location.href = "/video-upload.html";
                routes();
            } else {
                lock.show({
                    closable: false,
                    theme: { "logo": "https://dl.dropboxusercontent.com/u/104095732/16388036_1703660259963949_4229443957888103359_n.jpg", "primaryColor": "#bf0202" },
                    language: "pt-br",
                    languageDictionary: { emailInputPlaceholder: "editaistudio@gmail.com", title: "Editaí" },
                    auth: {
                        responseType: 'token',
                        params: {
                            scope: 'openid email'
                        }
                    }
                });
            }
        });
    }


    lock.on("authenticated", function(authResult) {
        lock.getProfile(authResult.idToken, function(error, profile) {
            if (error) {
                localStorage.removeItem('id_token');
                localStorage.removeItem('profile');
                return alert('There was an error getting the profile: ' + error.message);
            } else {
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                window.location.href = "/console.html";
                show_profile_info(profile);
            }

        });
    });

    var show_profile_info = function(profile) {
        var avatar = document.getElementById('avatar');

        if (avatar) {
            avatar.src = profile.picture;
            avatar.style.display = "block";
            document.getElementById('complete-name').textContent = profile.nickname;
            document.getElementById('email').textContent = profile.email;
            document.getElementById('nickname').textContent = profile.nickname;
        }

    };

    var logout = function() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        window.location.href = "/";
        document.location.href = "/";
    };

    var routes = function() {
        var id_token = localStorage.getItem('id_token');
        var current_location = window.location.pathname;

        if (id_token) {
            var profile = JSON.parse(localStorage.getItem('profile'));

            switch (current_location) {
                case "/video-upload.html":
                    retrieve_profile();
                    break;
                case "/console.html":
                    retrieve_profile();
                    break;
                case "/":
                    window.location.href = '/console.html';
                    break;
            };

        } else {
            if ("/" != current_location) {
                logout();
            }
        }
    };

    var retrieve_profile = function() {
        var id_token = localStorage.getItem('id_token');
        if (id_token) {
            lock.getProfile(id_token, function(err, profile) {
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                } else {
                    show_profile_info(profile);
                }
            });
        }
    };

    routes();
});
