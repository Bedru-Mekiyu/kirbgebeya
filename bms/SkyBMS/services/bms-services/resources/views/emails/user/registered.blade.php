@component('mail::message')
    # Welcome to Our Site!

    Your account has been successfully registered.

    Here is your randomly generated password: **{{ $password }}**

    We recommend changing your password after logging in.

    Thanks,
    {{ config('app.name') }}
@endcomponent
