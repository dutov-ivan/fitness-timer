"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import TrainingForm from "@/components/training-form";
import TrainingView from "@/components/training-view";
import type { Training, Exercise } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { DEFAULT_EXERCISES } from "./exercises";

export default function Home() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTrainings = localStorage.getItem("trainings");
    const savedExercises = localStorage.getItem("customExercises");

    if (savedTrainings) {
      // Handle migration for older training data without restTime
      const parsedTrainings = JSON.parse(savedTrainings);
      const migratedTrainings = parsedTrainings.map((training: any) => ({
        ...training,
        restTime: training.restTime || 30, // Default to 30 seconds if not present
      }));
      setTrainings(migratedTrainings);
    }

    if (savedExercises) {
      setCustomExercises(JSON.parse(savedExercises));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("trainings", JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem("customExercises", JSON.stringify(customExercises));
  }, [customExercises]);

  const handleAddTraining = () => {
    setIsFormOpen(true);
    setEditingTraining(null);
    setSelectedTraining(null);
  };

  const handleSelectTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsFormOpen(false);
  };

  const handleSaveTraining = (training: Training) => {
    if (editingTraining) {
      // Update existing training
      setTrainings(trainings.map((t) => (t.id === training.id ? training : t)));
      toast({
        title: "Тренування оновлено",
        description: `${training.name} успішно оновлено.`,
      });
    } else {
      // Add new training
      setTrainings([...trainings, training]);
      toast({
        title: "Тренування створено",
        description: `${training.name} успішно створено.`,
      });
    }
    setIsFormOpen(false);
    setSelectedTraining(training);
  };

  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const handleDeleteTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
    if (selectedTraining?.id === id) {
      setSelectedTraining(null);
    }
    toast({
      title: "Тренування видалено",
      description: "Тренування успішно видалено.",
    });
  };

  const handleSaveCustomExercise = (exercise: Exercise) => {
    setCustomExercises([...customExercises, exercise]);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold px-4">Таймер тренувань</h2>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddTraining}
              className="mr-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Додати тренування</span>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Тренування</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {trainings.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Немає тренувань. Створіть одне!
                    </div>
                  ) : (
                    trainings.map((training) => (
                      <SidebarMenuItem key={training.id}>
                        <SidebarMenuButton
                          onClick={() => handleSelectTraining(training)}
                          isActive={selectedTraining?.id === training.id}
                        >
                          {training.name}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col p-4 w-full justify-center items-center">
          <header className="flex items-center h-16 gap-2 border-b mb-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">
              {isFormOpen
                ? editingTraining
                  ? "Редагувати тренування"
                  : "Створити нове тренування"
                : selectedTraining
                ? selectedTraining.name
                : "Виберіть або створіть тренування"}
            </h1>
          </header>

          <main className="flex-1">
            {isFormOpen ? (
              <TrainingForm
                onSave={handleSaveTraining}
                predefinedExercises={[...DEFAULT_EXERCISES, ...customExercises]}
                onSaveCustomExercise={handleSaveCustomExercise}
                editingTraining={editingTraining}
              />
            ) : selectedTraining ? (
              <TrainingView
                training={selectedTraining}
                onEdit={() => handleEditTraining(selectedTraining)}
                onDelete={() => handleDeleteTraining(selectedTraining.id)}
                allExercises={[...DEFAULT_EXERCISES, ...customExercises]}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center mt-4">
                <h2 className="text-2xl font-semibold mb-4">
                  Ласкаво просимо до Таймера тренувань
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Виберіть тренування з бічної панелі або створіть нове, щоб
                  почати.
                </p>
                <Button onClick={handleAddTraining}>
                  Створити нове тренування
                </Button>
              </div>
            )}
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
