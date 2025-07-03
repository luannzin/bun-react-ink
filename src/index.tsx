import { useState, useEffect } from "react";
import { Box, render, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import SelectInput from "ink-select-input";

const items = [
	{
		label: "Email",
		value: "email",
	},
	{
		label: "Username",
		value: "username",
	},
	{
		label: "Age",
		value: "age",
	},
];

const Counter = () => {
	const [loading, setLoading] = useState(false);

	const [tab, setTab] = useState("");
	const [query, setQuery] = useState("");

	const [form, setForm] = useState({
		name: "",
		username: "",
		age: "",
	});

	const handleSelect = (item: { label: string; value: string }) => {
		if (!form[item.value as keyof typeof form]) {
			setLoading(true);
			const timeout = setTimeout(() => {
				setLoading(false);
				setTab(item.value);
			}, 200);
			return () => clearTimeout(timeout);
		}
	};

	useInput((input, key) => {
		if (tab) {
			if (key.return) {
				setTab("");
				setForm((f) => ({ ...f, [tab]: query }));
				return;
			}

			if (key.backspace) {
				setQuery((q) => q.slice(0, -1));
				return;
			}
			setQuery((q) => `${q}${input}`);
			return;
		}
	});

	useEffect(() => {
		if (!tab) {
			setQuery("");
		}
	}, [tab]);

	return (
		<Box marginTop={1}>
			{loading ? (
				<Text>
					<Text color="green">
						<Spinner type="dots" />
					</Text>{" "}
					Loading...
				</Text>
			) : (
				<>
					{!tab ? (
						<Box flexDirection="column" gap={0.5}>
							<Text color="green">Select the field you want to fill:</Text>
							<SelectInput
								items={items}
								onSelect={handleSelect}
								itemComponent={(props) => {
									const formValue =
										form[props.label.toLowerCase() as keyof typeof form];

									return (
										<Text
											color={
												props.isSelected && !formValue
													? "green"
													: formValue
														? "gray"
														: "white"
											}
											dimColor={!!formValue}
										>
											{props.label}{" "}
											{formValue ? <Text color="green">✓</Text> : <></>}
										</Text>
									);
								}}
							/>
						</Box>
					) : (
						<>
							<Box gap={1}>
								<Text color={"green"}>Insert your {tab}:</Text>
								<Text color={query ? "white" : "gray"}>
									{query ? query : "insert something"}
								</Text>
							</Box>
						</>
					)}
				</>
			)}
		</Box>
	);
};

render(<Counter />);
