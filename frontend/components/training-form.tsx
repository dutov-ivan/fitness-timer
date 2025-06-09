"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { X, ArrowUp, ArrowDown, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Training, Exercise, TrainingExercise } from "@/lib/types";
import { toast } from "sonner";

interface TrainingFormProps {
  onSave: (training: Training) => void;
  predefinedExercises: Exercise[];
  onSaveCustomExercise: (exercise: Exercise) => void;
  editingTraining: Training | null;
}

export default function TrainingForm({
  onSave,
  predefinedExercises,
  onSaveCustomExercise,
  editingTraining,
}: TrainingFormProps) {
  const [name, setName] = useState("");
  const [restTime, setRestTime] = useState(30);
  const [exercises, setExercises] = useState<TrainingExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseDuration, setNewExerciseDuration] = useState(60);

  // Initialize form if editing an existing training
  useEffect(() => {
    if (editingTraining) {
      setName(editingTraining.name);
      setExercises(editingTraining.exercises);
      setRestTime(editingTraining.restTime || 30);
    }
  }, [editingTraining]);

  const handleAddExercise = (exerciseId: string) => {
    const exercise = predefinedExercises.find((e) => e.id === exerciseId);
    if (exercise) {
      setExercises([
        ...exercises,
        {
          id: uuidv4(),
          exerciseId: exercise.id,
          duration: exercise.duration,
        },
      ]);
      setSearchTerm("");
    }
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleMoveExercise = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === exercises.length - 1)
    ) {
      return;
    }

    const newExercises = [...exercises];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap the exercises
    [newExercises[index], newExercises[targetIndex]] = [
      newExercises[targetIndex],
      newExercises[index],
    ];

    setExercises(newExercises);
  };

  const handleChangeDuration = (index: number, duration: number) => {
    const newExercises = [...exercises];
    newExercises[index].duration = duration;
    setExercises(newExercises);
  };

  const handleSaveTraining = () => {
    if (!name.trim()) {
      toast.error("Будь ласка, введіть назву тренування");
      return;
    }

    if (exercises.length === 0) {
      toast.error("Будь ласка, додайте хоча б одну вправу");
      return;
    }

    const training: Training = {
      id: editingTraining?.id || uuidv4(),
      name,
      restTime,
      exercises,
    };

    onSave(training);
    toast.success("Тренування збережено");
  };

  const handleCreateCustomExercise = () => {
    if (!newExerciseName.trim()) {
      toast.error("Будь ласка, введіть назву вправи");
      return;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: newExerciseName,
      duration: newExerciseDuration,
      isRest: false,
      custom: true,
    };

    // First save the custom exercise
    onSaveCustomExercise(newExercise);

    // Then add it to the training
    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        exerciseId: newExercise.id,
        duration: newExercise.duration,
      },
    ]);

    // Reset form and close dialog
    setNewExerciseName("");
    setNewExerciseDuration(60);
    setDialogOpen(false);
    toast.success("Вправу додано до тренування");
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = predefinedExercises.find((e) => e.id === exerciseId);
    return exercise?.name || "Unknown Exercise";
  };

  const filteredExercises = predefinedExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateDialog = () => {
    setNewExerciseName(searchTerm);
    setDialogOpen(true);
    setOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingTraining
              ? "Редагувати тренування"
              : "Створити нове тренування"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="training-name">Назва тренування</Label>
            <Input
              id="training-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введіть назву тренування"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rest-time">
              Час відпочинку між вправами (секунди)
            </Label>
            <Input
              id="rest-time"
              type="number"
              min="5"
              value={restTime}
              onChange={(e) => setRestTime(Number.parseInt(e.target.value))}
              placeholder="Введіть час відпочинку в секундах"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Вправи</Label>
              <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Додати вправу</Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="end" side="bottom">
                    <Command>
                      <CommandInput
                        placeholder="Пошук вправ..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Вправу не знайдено.
                          <Button
                            variant="ghost"
                            className="mt-2 w-full justify-start"
                            onClick={handleOpenCreateDialog}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Створити "{searchTerm}"
                          </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredExercises.map((exercise) => (
                            <CommandItem
                              key={exercise.id}
                              value={exercise.name}
                              onSelect={() => {
                                handleAddExercise(exercise.id);
                                setOpen(false);
                              }}
                            >
                              {exercise.name}
                              <span className="ml-auto text-xs text-muted-foreground">
                                {exercise.duration}s
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                Вправи ще не додані. Додайте вправи до вашого тренування.
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-2 p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {getExerciseName(exercise.exerciseId)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="5"
                        className="w-20"
                        value={exercise.duration}
                        onChange={(e) =>
                          handleChangeDuration(
                            index,
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">сек</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExercise(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExercise(index, "down")}
                        disabled={index === exercises.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTraining} className="ml-auto">
            <Save className="mr-2 h-4 w-4" />
            Зберегти тренування
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити власну вправу</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Назва вправи</Label>
              <Input
                id="exercise-name"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Введіть назву вправи"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise-duration">Тривалість (секунди)</Label>
              <Input
                id="exercise-duration"
                type="number"
                min="5"
                value={newExerciseDuration}
                onChange={(e) =>
                  setNewExerciseDuration(Number.parseInt(e.target.value))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCustomExercise}>
              Створити вправу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
