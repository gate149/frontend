"use client";

import {
    ActionIcon,
    Button,
    Center,
    Group,
    Select,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useRef, useState } from "react";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import classes from "./styles.module.css";

const languages = ["python", "cpp", "golang"];

type Props = {
    onSubmit: (solution: FormData, language: string) => Promise<number | null>;
};

const CreateSolutionForm = ({ onSubmit }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        initialValues: {
            code: "",
            language: languages[0],
        },
        validate: {
            code: (value) => (!value && !file ? "Code or file is required" : null),
            language: (value) => (languages.includes(value) ? null : "Invalid language"),
        },
    });

    // React Query mutation for form submission
    const mutation = useMutation({
        mutationFn: async (values: typeof form.values) => {
            const formData = new FormData();
            if (file) {
                formData.append("solution", file);
            } else {
                formData.append("solution", values.code);
            }
            return await onSubmit(formData, values.language);
        },
        onSuccess: (data) => {
            if (data) {
                form.reset();
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        },
        onError: (error) => {
            console.error("Submission error:", error);
            // You can add notification here
        },
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            form.setFieldValue("code", "");
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const textData = event.dataTransfer.getData("text/plain");
        if (textData) {
            form.setFieldValue("code", textData);
            setFile(null);
            return;
        }

        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && /\.(py|cpp|go|txt)$/i.test(droppedFile.name)) {
            setFile(droppedFile);
            form.setFieldValue("code", "");
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form
            onSubmit={form.onSubmit((values) => mutation.mutate(values))}
        >
            <Stack
                className={classes.code}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                data-dragging={isDragging}
            >
                <Group justify="space-between">
                    <Select
                        data={languages}
                        allowDeselect={false}
                        {...form.getInputProps("language")}
                        style={{ width: "200px" }}
                    />
                    <Button
                        component="label"
                        variant="light"
                        leftSection={<IconUpload size={16} />}
                        classNames={{
                            label: classes.pinFileLabel,
                            section: classes.pinFileSection,
                            root: classes.pinFileRoot,
                        }}
                    >
                        Прикрепить файл
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".py,.cpp,.go,.txt"
                        />
                    </Button>
                </Group>

                <div className={classes.dropZone}>
                    {isDragging ? (
                        <Center className={classes.dragOverlay}>
                            <Stack align="center" gap="xs">
                                <Text c="blue" size="lg" ta="center">
                                    Перетащите файл или текст сюда
                                </Text>
                                <Text c="dimmed" size="sm" ta="center">
                                    Поддерживаются .py, .cpp, .go или обычный текст
                                </Text>
                            </Stack>
                        </Center>
                    ) : file ? (
                        <div className={classes.fileAttached}>
                            <Group className={classes.fileInfo}>
                                <Text>Прикреплен файл: {file.name}</Text>
                            </Group>
                            <ActionIcon
                                onClick={removeFile}
                                color="red"
                                className={classes.deleteButton}
                                variant="subtle"
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </div>
                    ) : (
                        <Textarea
                            {...form.getInputProps("code")}
                            placeholder="Введите ваше решение здесь, перетащите файл или текст..."
                            classNames={{ input: classes.input }}
                        />
                    )}
                </div>

                <Button type="submit" loading={mutation.isPending}>
                    Отправить решение
                </Button>
            </Stack>
        </form>
    );
};

export { CreateSolutionForm };