@extends('auth.layouts.authentication')

@section('content')
    @php
        // Images come from the backend: Website Setup > Authentication Layout (register image),
        // falling back to the first homepage slider image, then a plain brand-colour panel.
        $register_image_url = null;
        $register_image_id = get_setting('customer_register_page_image');
        if ($register_image_id && ($register_upload = \App\Models\Upload::find($register_image_id))) {
            $register_image_url = $register_upload->external_link ?: my_asset($register_upload->file_name);
        }
        if (!$register_image_url) {
            $slider_ids = json_decode(get_setting('home_slider_images', null, get_system_language()->code), true);
            if (is_array($slider_ids) && count($slider_ids) > 0) {
                $first_slider = \App\Models\Upload::find($slider_ids[0]);
                if ($first_slider) {
                    $register_image_url = $first_slider->external_link ?: my_asset($first_slider->file_name);
                }
            }
        }

        // Logo: site icon > header logo > default logo file
        $register_logo_url = static_asset('assets/img/logo.png');
        foreach (['site_icon', 'header_logo'] as $logo_setting) {
            $logo_id = get_setting($logo_setting);
            if ($logo_id && ($logo_upload = \App\Models\Upload::find($logo_id))) {
                $register_logo_url = $logo_upload->external_link ?: my_asset($logo_upload->file_name);
                break;
            }
        }
    @endphp
    <style>
        .register-card { border-radius: 14px; overflow: hidden; box-shadow: 0 12px 40px rgba(16, 24, 40, .10); }
        .register-visual { position: relative; min-height: 260px; background: var(--primary); background-size: cover; background-position: center; }
        .register-visual::before { content: ""; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.35) 45%, var(--primary) 100%); opacity: .92; }
        .register-visual-content { position: relative; z-index: 1; }
        .register-visual .register-perk { display: flex; align-items: center; margin-bottom: .6rem; }
        .register-visual .register-perk i { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.18); display: inline-flex; align-items: center; justify-content: center; margin-right: .6rem; font-size: 16px; }
        .register-form .form-control { border-radius: 8px !important; height: 44px; }
        .register-form .btn-primary { border-radius: 8px !important; height: 46px; }
        @media (min-width: 992px) { .register-visual { min-height: 100%; } }
        @media (max-width: 991px) {
            .register-visual { min-height: 200px; }
            .register-form.right-content { margin-top: -32px; min-height: 0; border-radius: 20px 20px 0 0; position: relative; z-index: 2; }
        }
    </style>
    <div class="aiz-main-wrapper d-flex flex-column justify-content-md-center bg-light">
        <section class="overflow-hidden py-4">
            <div class="row">
                <div class="col-xxl-7 col-xl-9 col-lg-10 col-md-8 mx-auto py-lg-4 px-3">
                    <div class="card shadow-none border-0 bg-transparent mb-0">
                        <div class="register-card bg-white">
                        <div class="row no-gutters">
                            <!-- Left Side Image (from backend) -->
                            <div class="col-lg-6 register-visual d-flex align-items-end"
                                @if ($register_image_url) style="background-image: url('{{ $register_image_url }}');" @endif
                                role="img" aria-label="{{ translate('Customer Register Page Image') }}">
                                <div class="register-visual-content p-4 p-lg-5 text-white w-100 d-none d-lg-block">
                                    <h2 class="fs-24 fs-md-28 fw-700 mb-2 text-white">{{ translate('Join us today') }}</h2>
                                    <p class="fs-14 mb-4 opacity-90">{{ translate('Create your free account and start shopping in minutes.') }}</p>
                                    <div class="register-perk fs-14"><i class="las la-shipping-fast"></i>{{ translate('Fast delivery to your door') }}</div>
                                    <div class="register-perk fs-14"><i class="las la-shield-alt"></i>{{ translate('Secure checkout') }}</div>
                                    <div class="register-perk fs-14 mb-0"><i class="las la-receipt"></i>{{ translate('Track every order') }}</div>
                                </div>
                            </div>

                            <!-- Right Side -->
                            <div class="col-lg-6 p-4 p-lg-5 d-flex flex-column justify-content-center bg-white right-content register-form" style="height: auto;">
                                <!-- Logo (from backend) -->
                                <div class="mb-3 text-center text-lg-left">
                                    <a href="{{ route('home') }}" class="d-inline-block">
                                        <img src="{{ $register_logo_url }}" alt="{{ translate('Logo') }}" class="h-40px w-auto mw-100"
                                            onerror="this.onerror=null;this.src='{{ static_asset('assets/img/logo.png') }}';">
                                    </a>
                                </div>

                                <!-- Titles -->
                                <div class="text-center text-lg-left">
                                    <h1 class="fs-22 fs-md-26 fw-700 text-dark mb-1">{{ translate('Create an account')}}</h1>
                                    <p class="fs-13 text-secondary mb-0">{{ translate('It only takes a minute.') }}</p>
                                </div>

                                <!-- Register form -->
                                <div class="pt-3">
                                    <div class="">
                                        <form id="reg-form" class="form-default" role="form" action="{{ route('register') }}" method="POST">
                                            @csrf
                                            <!-- Name -->
                                            <div class="form-group">
                                                <label for="name" class="fs-12 fw-700 text-soft-dark">{{  translate('Full Name') }}</label>
                                                <input type="text" class="form-control rounded-0{{ $errors->has('name') ? ' is-invalid' : '' }}" value="{{ old('name') }}" placeholder="{{  translate('Full Name') }}" name="name">
                                                @if ($errors->has('name'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('name') }}</strong>
                                                    </span>
                                                @endif
                                            </div>

                                            <!-- Email or Phone -->
                                            @if (addon_is_activated('otp_system'))
                                                <div class="form-group phone-form-group mb-1">
                                                    <label for="phone" class="fs-12 fw-700 text-soft-dark">{{  translate('Phone') }}</label>
                                                    <input type="tel" id="phone-code" class="form-control rounded-0{{ $errors->has('phone') ? ' is-invalid' : '' }}" value="{{ old('phone') }}" placeholder="" name="phone" autocomplete="off">
                                                </div>

                                                <input type="hidden" name="country_code" value="">

                                                <div class="form-group email-form-group mb-1 d-none">
                                                    <label for="email" class="fs-12 fw-700 text-soft-dark">{{  translate('Email') }}</label>
                                                    <input type="email" class="form-control rounded-0 {{ $errors->has('email') ? ' is-invalid' : '' }}" value="{{ old('email') }}" placeholder="{{  translate('Email') }}" name="email"  autocomplete="off">
                                                    @if ($errors->has('email'))
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $errors->first('email') }}</strong>
                                                        </span>
                                                    @endif
                                                </div>

                                                <div class="form-group text-right">
                                                    <button class="btn btn-link p-0 text-primary" type="button" onclick="toggleEmailPhone(this)"><i>*{{ translate('Use Email Instead') }}</i></button>
                                                </div>
                                            @else
                                                <div class="form-group">
                                                    <label for="email" class="fs-12 fw-700 text-soft-dark">{{  translate('Email') }}</label>
                                                    <input type="email" class="form-control rounded-0{{ $errors->has('email') ? ' is-invalid' : '' }}" value="{{ old('email') }}" placeholder="{{  translate('Email') }}" name="email">
                                                    @if ($errors->has('email'))
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $errors->first('email') }}</strong>
                                                        </span>
                                                    @endif
                                                </div>
                                            @endif

                                            <!-- password -->
                                            <div class="form-group mb-0">
                                                <label for="password" class="fs-12 fw-700 text-soft-dark">{{  translate('Password') }}</label>
                                                <div class="position-relative">
                                                    <input type="password" class="form-control rounded-0{{ $errors->has('password') ? ' is-invalid' : '' }}" placeholder="{{  translate('Password') }}" name="password">
                                                    <i class="password-toggle las la-2x la-eye"></i>
                                                </div>
                                                <div class="text-right mt-1">
                                                    <span class="fs-12 fw-400 text-gray-dark">{{ translate('Password must contain at least 6 digits') }}</span>
                                                </div>
                                                @if ($errors->has('password'))
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $errors->first('password') }}</strong>
                                                    </span>
                                                @endif
                                            </div>

                                            <!-- password Confirm -->
                                            <div class="form-group">
                                                <label for="password_confirmation" class="fs-12 fw-700 text-soft-dark">{{  translate('Confirm Password') }}</label>
                                                <div class="position-relative">
                                                    <input type="password" class="form-control rounded-0" placeholder="{{  translate('Confirm Password') }}" name="password_confirmation">
                                                    <i class="password-toggle las la-2x la-eye"></i>
                                                </div>
                                            </div>

                                            <!-- Recaptcha -->
                                            @if(get_setting('google_recaptcha') == 1)
                                                <div class="form-group">
                                                    <div class="g-recaptcha" data-sitekey="{{ env('CAPTCHA_KEY') }}"></div>
                                                </div>
                                                @if ($errors->has('g-recaptcha-response'))
                                                    <span class="invalid-feedback" role="alert" style="display: block;">
                                                        <strong>{{ $errors->first('g-recaptcha-response') }}</strong>
                                                    </span>
                                                @endif
                                            @endif

                                            <!-- Terms and Conditions -->
                                            <div class="mb-3">
                                                <label class="aiz-checkbox">
                                                    <input type="checkbox" name="checkbox_example_1" required>
                                                    <span class="">{{ translate('By signing up you agree to our ')}} <a href="{{ route('terms') }}" class="fw-500">{{ translate('terms and conditions.') }}</a></span>
                                                    <span class="aiz-square-check"></span>
                                                </label>
                                            </div>

                                            <!-- Submit Button -->
                                            <div class="mb-4 mt-4">
                                                <button type="submit" class="btn btn-primary btn-block fw-600 rounded-0">{{  translate('Create Account') }}</button>
                                            </div>
                                        </form>
                                        
                                        <!-- Social Login -->
                                        @if(get_setting('google_login') == 1 || get_setting('facebook_login') == 1 || get_setting('twitter_login') == 1 || get_setting('apple_login') == 1)
                                            <div class="text-center mb-3">
                                                <span class="bg-white fs-12 text-gray">{{ translate('Or Join With')}}</span>
                                            </div>
                                            <ul class="list-inline social colored text-center mb-4">
                                                @if (get_setting('facebook_login') == 1)
                                                    <li class="list-inline-item">
                                                        <a href="{{ route('social.login', ['provider' => 'facebook']) }}" class="facebook">
                                                            <i class="lab la-facebook-f"></i>
                                                        </a>
                                                    </li>
                                                @endif
                                                @if(get_setting('google_login') == 1)
                                                    <li class="list-inline-item">
                                                        <a href="{{ route('social.login', ['provider' => 'google']) }}" class="google">
                                                            <i class="lab la-google"></i>
                                                        </a>
                                                    </li>
                                                @endif
                                                @if (get_setting('twitter_login') == 1)
                                                    <li class="list-inline-item">
                                                        <a href="{{ route('social.login', ['provider' => 'twitter']) }}" class="twitter">
                                                            <i class="lab la-twitter"></i>
                                                        </a>
                                                    </li>
                                                @endif
                                                @if (get_setting('apple_login') == 1)
                                                    <li class="list-inline-item">
                                                        <a href="{{ route('social.login', ['provider' => 'apple']) }}" class="apple">
                                                            <i class="lab la-apple"></i>
                                                        </a>
                                                    </li>
                                                @endif
                                            </ul>
                                        @endif
                                    </div>

                                    <!-- Log In -->
                                    <p class="fs-12 text-gray mb-0">
                                        {{ translate('Already have an account?')}}
                                        <a href="{{ route('user.login') }}" class="ml-2 fs-14 fw-700 animate-underline-primary">{{ translate('Log In')}}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                        <!-- Go Back -->
                        <div class="mt-3 mr-4 mr-md-0">
                            <a href="{{ url()->previous() }}" class="ml-auto fs-14 fw-700 d-flex align-items-center text-primary" style="max-width: fit-content;">
                                <i class="las la-arrow-left fs-20 mr-1"></i>
                                {{ translate('Back to Previous Page')}}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
@endsection

@section('script')
    @if(get_setting('google_recaptcha') == 1)
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    @endif

    <script type="text/javascript">
        @if(get_setting('google_recaptcha') == 1)
        // making the CAPTCHA  a required field for form submission
        $(document).ready(function(){
            $("#reg-form").on("submit", function(evt)
            {
                var response = grecaptcha.getResponse();
                if(response.length == 0)
                {
                //reCaptcha not verified
                    alert("please verify you are human!");
                    evt.preventDefault();
                    return false;
                }
                //captcha verified
                //do the rest of your validations here
                $("#reg-form").submit();
            });
        });
        @endif
    </script>
@endsection