<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_todos_on_home_page(): void
    {
        $todo1 = Todo::factory()->pending()->create(['title' => 'Buy groceries']);
        $todo2 = Todo::factory()->completed()->create(['title' => 'Walk the dog']);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Welcome')
                ->has('todos', 2)
                ->where('todos.0.title', 'Buy groceries')
                ->where('todos.0.completed', false)
                ->where('todos.1.title', 'Walk the dog')
                ->where('todos.1.completed', true)
        );
    }

    public function test_can_create_todo(): void
    {
        $response = $this->post('/todos', [
            'title' => 'Learn Laravel'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'title' => 'Learn Laravel',
            'completed' => false
        ]);
    }

    public function test_cannot_create_todo_without_title(): void
    {
        $response = $this->post('/todos', []);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['title']);
    }

    public function test_can_toggle_todo_completion(): void
    {
        $todo = Todo::factory()->pending()->create();

        $response = $this->patch("/todos/{$todo->id}", [
            'completed' => true
        ]);

        $response->assertStatus(200);
        $this->assertTrue($todo->fresh()->completed);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->delete("/todos/{$todo->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_todos_are_ordered_correctly(): void
    {
        // Create todos in different order
        $completed = Todo::factory()->completed()->create(['title' => 'Completed task']);
        $pending1 = Todo::factory()->pending()->create(['title' => 'First pending']);
        $pending2 = Todo::factory()->pending()->create(['title' => 'Second pending']);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->component('Welcome')
                ->has('todos', 3)
                ->where('todos.0.completed', false) // Pending tasks first
                ->where('todos.1.completed', false)
                ->where('todos.2.completed', true)  // Completed tasks last
        );
    }
}