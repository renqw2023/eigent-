import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Calculator,
	Calendar,
	Smile,
} from "lucide-react";

import {
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandDialog,
	CommandInput,
	CommandGroup,
	CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";

const items = [
	"Apple",
	"Banana",
	"Orange",
	"Grape",
	"Watermelon",
	"Pineapple",
	"Mango",
	"Blueberry",
];

export function GlobalSearch() {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<div
				className="h-6 bg-bg-surface-secondary flex items-center justify-center w-60 rounded-lg space-x-2 no-drag"
				onClick={() => setOpen(true)}
			>
				<Search className="w-4 h-4 text-text-secondary"></Search>
				<span className="text-text-secondary font-inter text-[10px] leading-4">
					{t('components.globalSearch.searchForTaskOrDocument')}
				</span>
			</div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="sr-only">Search</DialogTitle>
				<CommandInput placeholder={t('components.globalSearch.typeACommandOrSearch')} />
				<CommandList>
					<CommandEmpty>{t('components.globalSearch.noResultsFound')}</CommandEmpty>
					<CommandGroup heading={t('components.globalSearch.today')}>
						<CommandItem>
							<Calendar />
							<span>{t('components.globalSearch.calendar')}</span>
						</CommandItem>
						<CommandItem>
							<Smile />
							<span>{t('components.globalSearch.searchEmoji')}</span>
						</CommandItem>
						<CommandItem>
							<Calculator />
							<span>{t('components.globalSearch.calculator')}</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
				</CommandList>
			</CommandDialog>
		</>
	);
}
