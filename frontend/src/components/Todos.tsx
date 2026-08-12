import React, {
  useEffect,
  useState,
  createContext,
} from "react";
 
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Stack,
  Text,
  DialogActionTrigger,
} from "@chakra-ui/react";
 
// =========================
// Backend API URL
// =========================
const API_URL = "http://3.24.123.219:8000";
 
// =========================
// Todo interface
// =========================
interface Todo {
  id: string;
  item: string;
}
 
// =========================
// Props interfaces
// =========================
interface UpdateTodoProps {
  item: string;
  id: string;
  fetchTodos: () => void;
}
 
interface TodoHelperProps {
  item: string;
  id: string;
  fetchTodos: () => void;
}
 
interface DeleteTodoProps {
  id: string;
  fetchTodos: () => void;
}
 
// =========================
// Context interface
// =========================
interface TodosContextType {
  todos: Todo[];
  fetchTodos: () => void;
}
 
// =========================
// Context
// =========================
const TodosContext = createContext<TodosContextType>({
  todos: [],
  fetchTodos: () => {},
});
 
// =========================
// ADD TODO
// =========================
function AddTodo() {
  const [item, setItem] = useState("");
 
  const { todos, fetchTodos } =
    React.useContext(TodosContext);
 
  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItem(event.target.value);
  };
 
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
 
    if (!item.trim()) {
      return;
    }
 
    const newTodo = {
      id: String(todos.length + 1),
      item: item,
    };
 
    await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
 
    setItem("");
 
    await fetchTodos();
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <Input
        pr="4.5rem"
        type="text"
        placeholder="Add a todo item"
        aria-label="Add a todo item"
        value={item}
        onChange={handleInput}
      />
    </form>
  );
}
 
// =========================
// UPDATE TODO
// =========================
const UpdateTodo = ({
  item,
  id,
  fetchTodos,
}: UpdateTodoProps) => {
  const [todo, setTodo] = useState(item);
 
  const updateTodo = async () => {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: todo,
      }),
    });
 
    await fetchTodos();
  };
 
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button h="1.5rem" size="sm">
          Update Todo
        </Button>
      </DialogTrigger>
 
      <DialogContent
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        p={6}
        rounded="md"
        shadow="xl"
        maxW="md"
        w="90%"
        zIndex={1000}
      >
        <DialogHeader>
          <DialogTitle>
            Update Todo
          </DialogTitle>
        </DialogHeader>
 
        <DialogBody>
          <Input
            pr="4.5rem"
            type="text"
            placeholder="Update todo item"
            aria-label="Update todo item"
            value={todo}
            onChange={(event) =>
              setTodo(event.target.value)
            }
          />
        </DialogBody>
 
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </DialogActionTrigger>
 
          <Button
            size="sm"
            onClick={updateTodo}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
 
// =========================
// DELETE TODO
// =========================
const DeleteTodo = ({
  id,
  fetchTodos,
}: DeleteTodoProps) => {
  const deleteTodo = async () => {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    await fetchTodos();
  };
 
  return (
    <Button
      h="1.5rem"
      size="sm"
      marginLeft={2}
      onClick={deleteTodo}
    >
      Delete Todo
    </Button>
  );
};
 
// =========================
// TODO HELPER
// =========================
function TodoHelper({
  item,
  id,
  fetchTodos,
}: TodoHelperProps) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
 
          <Flex align="end">
            <UpdateTodo
              item={item}
              id={id}
              fetchTodos={fetchTodos}
            />
 
            <DeleteTodo
              id={id}
              fetchTodos={fetchTodos}
            />
          </Flex>
        </Text>
      </Flex>
    </Box>
  );
}
 
// =========================
// MAIN TODOS COMPONENT
// =========================
export default function Todos() {
  const [todos, setTodos] =
    useState<Todo[]>([]);
 
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/todo`
      );
 
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }
 
      const data = await response.json();
 
      setTodos(data.data);
    } catch (error) {
      console.error(
        "Error fetching todos:",
        error
      );
    }
  };
 
  useEffect(() => {
    fetchTodos();
  }, []);
 
  return (
    <TodosContext.Provider
      value={{
        todos,
        fetchTodos,
      }}
    >
      <Container
        maxW="container.xl"
        pt="100px"
      >
        <AddTodo />
 
        <Stack gap={5} mt={5}>
          {todos.map((todo) => (
            <TodoHelper
              key={todo.id}
              item={todo.item}
              id={todo.id}
              fetchTodos={fetchTodos}
            />
          ))}
        </Stack>
      </Container>
    </TodosContext.Provider>
  );
}
