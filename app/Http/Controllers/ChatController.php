<?php

namespace App\Http\Controllers;

use App\Events\ChatEvent;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
     /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index() {
        return view('chat');
    }

    public function send(request $request) {
        $user = User::find(Auth::id());
        broadcast(new ChatEvent($request->message, $user, $request->timestamp))->toOthers();
        //return ['message' => $request->message, 'username' => $user->name, 'timestamp' => $request->timestamp ];
    }
}
