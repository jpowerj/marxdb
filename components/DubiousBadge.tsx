import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => {
    return {
        infoIcon: {
            cursor: 'default!important'
        },
    }
}

);

const useInfoIcon = () => {
    const { classes, theme } = useStyles();
    return (
        <ActionIcon
            variant="transparent"
            color="dark"
            className={classes.infoIcon}
            disabled
            sx={{
                '&[data-disabled]': { opacity: 1, color: 'black' },
            }}
            size={20}
        >
            <InfoCircle />
        </ActionIcon>
    )
}

const DubiousBadge = (classes: any) => {
    const infoIcon = useInfoIcon();
    return (
        <Group style={{ verticalAlign: 'middle' }}>
            <Tooltip label="Authorship of this text is disputed" radius="md" withArrow>
                <Badge
                    sx={{ paddingLeft: 0, backgroundColor: 'lightgray' }}
                    size="md"
                    radius="xl"
                    leftSection={infoIcon}
                    color="dark"
                >
                    Dubious
                </Badge>
            </Tooltip>
        </Group>
    );
}

export default DubiousBadge;
