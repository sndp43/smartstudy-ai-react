<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SmartStudyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', [SmartStudyController::class, 'health']);

// Role Authentication
Route::post('/auth/teacher/login', [SmartStudyController::class, 'teacherLogin']);
Route::post('/auth/student/login', [SmartStudyController::class, 'studentLogin']);
Route::get('/teachers', [SmartStudyController::class, 'teachers']);

// Learners & Reports
Route::get('/children', [SmartStudyController::class, 'children']);
Route::post('/children', [SmartStudyController::class, 'createChild']);
Route::get('/children/{childId}', [SmartStudyController::class, 'child']);
Route::get('/children/{childId}/skills', [SmartStudyController::class, 'skills']);
Route::get('/children/{childId}/dashboard', [SmartStudyController::class, 'dashboard']);
Route::get('/children/{childId}/report', [SmartStudyController::class, 'report']);
Route::get('/children/{childId}/patterns', [SmartStudyController::class, 'patterns']);
Route::delete('/children/{childId}/misconceptions', [SmartStudyController::class, 'clearMisconceptions']);
Route::get('/children/{childId}/worksheets', [SmartStudyController::class, 'worksheets']);

// Exercises & Practice
Route::post('/exercises/generate', [SmartStudyController::class, 'generate']);
Route::post('/attempts', [SmartStudyController::class, 'attempt']);
// Charts & Reference
Route::get('/learning-charts', [SmartStudyController::class, 'learningCharts']);
Route::get('/learning-charts/{slug}', [SmartStudyController::class, 'learningChart']);
Route::get('/children/{childId}/chart-progress', [SmartStudyController::class, 'chartProgress']);
Route::post('/children/{childId}/chart-progress', [SmartStudyController::class, 'recordChartProgress']);
Route::get('/tts', [SmartStudyController::class, 'tts']);

// Worksheet Ingestion
Route::post('/materials/worksheet/analyze', [SmartStudyController::class, 'material']);

// Curriculum & Skill Management
Route::post('/skills', [SmartStudyController::class, 'createSkill']);
Route::put('/skills/{skillId}', [SmartStudyController::class, 'updateSkill']);
Route::delete('/skills/{skillId}', [SmartStudyController::class, 'deleteSkill']);
Route::get('/skills/{skillId}/exercises', [SmartStudyController::class, 'skillExercises']);
Route::post('/skills/{skillId}/exercises', [SmartStudyController::class, 'createExercise']);
Route::put('/exercises/{exerciseId}', [SmartStudyController::class, 'updateExercise']);
Route::delete('/exercises/{exerciseId}', [SmartStudyController::class, 'deleteExercise']);
