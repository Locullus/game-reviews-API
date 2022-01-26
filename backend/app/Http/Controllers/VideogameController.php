<?php

namespace App\Http\Controllers;

use App\Models\Videogame;
use Illuminate\Http\Request;

class VideogameController extends CoreController
{
    /**
     * /videogames
     * GET
     */
    public function list()
    {
        // Get all items
        $list = Videogame::all();

        // Return JSON of this list
        return $this->sendJsonResponse($list, 200);
    }

    /**
     * /videogames/[id]
     * GET
     */
    public function read($id)
    {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Return JSON of this list
            return $this->sendJsonResponse($item, 200);
        } else { // Sinon
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * /videogames/[id]/reviews
     * GET
     */
    public function getReviews($id)
    {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Retrieve all related Reviews (thanks to Relationships)
            $reviews = $item->reviews->load(['videogame', 'platform']);
            // But, relationships with videogame & plaftorm are not configured yet
            // $reviews = $item->reviews;

            // Return JSON of this list
            return $this->sendJsonResponse($reviews, 200);
        } else { // Sinon
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * /videogames
     * POST
     */
    public function add(Request $request)
    {
        // le status ayant une valeur par défaut dans la table, on vérifie sa présence éventuelle
        if ($request->filled('status'))
        {
            $this->validate($request, ['status' => 'integer|min:0|max:1']);
        }

        // on vérifie la présence des éléments requis et on les valide
        $this->validate($request, [
            'name'      => 'required|String',
            'editor'    => 'required|String'
        ]);

        // on instancie notre Model
        $videogame = new Videogame();

        // on l'hydrate
        $videogame->name = $request->input('name');
        $videogame->editor = $request->input('editor');

        // on insère dans la BDD
        if ($videogame->save())
        {
            return response()->json($videogame, 201);
        }
        return response(['error' => 'Internal Server Error'], 500);
    }
}
