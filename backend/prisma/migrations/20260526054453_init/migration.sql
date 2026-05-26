-- CreateTable
CREATE TABLE `work_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `default_unit` VARCHAR(16) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `work_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_date` DATE NOT NULL,
    `work_type_id` INTEGER NOT NULL,
    `volume` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(16) NOT NULL,
    `executor_name` VARCHAR(120) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `journal_entries_work_date_idx`(`work_date`),
    INDEX `journal_entries_work_type_id_idx`(`work_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_work_type_id_fkey` FOREIGN KEY (`work_type_id`) REFERENCES `work_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
