@component('mail::message')
    # Welcome to SkyBMS !

    Your account has been successfully registered.

    Here is your randomly generated password: **{{ $password }}**

    Thanks,
    {{ config('app.name') }}
@endcomponent
