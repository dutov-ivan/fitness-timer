export interface Exercise {
  id: string
  name: string
  duration: number
  isRest: boolean
  custom: boolean
}

export interface TrainingExercise {
  id: string
  exerciseId: string
  duration: number
}

export interface Training {
  id: string
  name: string
  restTime: number
  exercises: TrainingExercise[]
}
