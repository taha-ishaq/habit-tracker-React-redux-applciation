import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Habit interface
export interface Habit {
    id: string;
    name: string;
    frequency: "daily" | "weekly";
    completedDates: string[];
    createdAt: string;
}

// Define the Habit state interface
interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
}

// Initial state with loading and error properties
const initialState: HabitState = {
    habits: [],
    isLoading: false,
    error: null,
};

// Create an async thunk to simulate an API call for fetching habits
export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
    // Simulate a static API response after a delay
    return new Promise<Habit[]>((resolve) =>
        setTimeout(() => {
            const mockHabits: Habit[] = [
                {
                    id: "1",
                    name: "Exercise",
                    frequency: "daily",
                    completedDates: [],
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    name: "Read Book",
                    frequency: "weekly",
                    completedDates: [],
                    createdAt: new Date().toISOString(),
                },
            ];
            resolve(mockHabits);
        }, 1000)
    );
});

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabit: (state, action: PayloadAction<{ name: string; frequency: "daily" | "weekly" }>) => {
            const newHabit: Habit = {
                id: Date.now().toString(),
                name: action.payload.name,
                frequency: action.payload.frequency,
                completedDates: [],
                createdAt: new Date().toISOString(),
            };

            state.habits.push(newHabit);
        },
        toggleHabit: (state, action: PayloadAction<{ id: string; date: string }>) => {
            const habit = state.habits.find((h) => h.id === action.payload.id);

            if (habit) {
                const index = habit.completedDates.indexOf(action.payload.date);
                if (index > -1) {
                    habit.completedDates.splice(index, 1);
                } else {
                    habit.completedDates.push(action.payload.date);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabits.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Clear any previous errors when fetching starts
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.habits = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to fetch habits";
            });
    },
});

export const { addHabit, toggleHabit } = habitSlice.actions;

export default habitSlice.reducer;
