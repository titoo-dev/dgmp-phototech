
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting database seeding...');

	// Clear existing data
	await prisma.user.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verification.deleteMany();
	await prisma.missionFile.deleteMany();
	await prisma.missionProject.deleteMany();
	await prisma.mission.deleteMany();
	await prisma.project.deleteMany();
	await prisma.contact.deleteMany();
	await prisma.company.deleteMany();

	console.log('🗑️  Cleared existing data');

	// Create Companies
	const companies = await Promise.all([
		prisma.company.create({
			data: {
				name: 'Tech Solutions Inc',
				email: 'contact@techsolutions.com',
				phoneNumber: '+1234567890',
				nif: '123456789',
				employeeCount: 150,
			},
		}),
		prisma.company.create({
			data: {
				name: 'Digital Innovations Ltd',
				email: 'info@digitalinnovations.com',
				phoneNumber: '+1987654321',
				nif: '987654321',
				employeeCount: 75,
			},
		}),
		prisma.company.create({
			data: {
				name: 'Green Energy Corp',
				email: 'hello@greenenergy.com',
				phoneNumber: '+1555123456',
				nif: '456789123',
				employeeCount: 200,
			},
		}),
		prisma.company.create({
			data: {
				name: 'Smart Manufacturing Co',
				email: 'contact@smartmanufacturing.com',
				phoneNumber: '+1444333222',
				nif: '789123456',
				employeeCount: 300,
			},
		}),
		prisma.company.create({
			data: {
				name: 'Healthcare Solutions',
				email: 'info@healthcaresolutions.com',
				phoneNumber: '+1666777888',
				nif: '321654987',
				employeeCount: 120,
			},
		}),
	]);

	console.log('🏢 Created 5 companies');

	// Create Contacts (members, not team leaders)
	const contacts = await Promise.all([
		prisma.contact.create({
			data: {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@company.com',
			},
		}),
		prisma.contact.create({
			data: {
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@company.com',
			},
		}),
		prisma.contact.create({
			data: {
				firstName: 'Michael',
				lastName: 'Johnson',
				email: 'michael.johnson@company.com',
			},
		}),
		prisma.contact.create({
			data: {
				firstName: 'Sarah',
				lastName: 'Wilson',
				email: 'sarah.wilson@company.com',
			},
		}),
		prisma.contact.create({
			data: {
				firstName: 'David',
				lastName: 'Brown',
				email: 'david.brown@company.com',
			},
		}),
	]);

	console.log('👥 Created 5 contacts');

	// Create Projects
	const projects = await Promise.all([
		prisma.project.create({
			data: {
				title: 'Website Redesign',
				description:
					'Complete redesign of company website with modern UI/UX',
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-06-30'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[0].id,
				nature: 'SERVICES',
			},
		}),
		prisma.project.create({
			data: {
				title: 'Mobile App Development',
				description:
					'Development of iOS and Android mobile applications',
				startDate: new Date('2024-02-01'),
				endDate: new Date('2024-08-31'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[0].id,
				nature: 'SERVICES',
			},
		}),
		prisma.project.create({
			data: {
				title: 'Cloud Migration',
				description: 'Migration of on-premise infrastructure to cloud',
				startDate: new Date('2024-01-15'),
				endDate: new Date('2024-05-15'),
				status: 'CONTROLLED_DELIVERED',
				companyId: companies[1].id,
				nature: 'PROGRAM',
			},
		}),
		prisma.project.create({
			data: {
				title: 'Data Analytics Platform',
				description:
					'Implementation of advanced analytics and reporting system',
				startDate: new Date('2024-03-01'),
				endDate: new Date('2024-09-30'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[2].id,
				nature: 'INTELLECTUAL',
			},
		}),
		prisma.project.create({
			data: {
				title: 'Security Audit',
				description:
					'Comprehensive security audit and vulnerability assessment',
				startDate: new Date('2024-02-15'),
				endDate: new Date('2024-04-15'),
				status: 'UNCONTROLLED',
				companyId: companies[3].id,
				nature: 'SERVICES',
			},
		}),
		prisma.project.create({
			data: {
				title: 'ERP System Implementation',
				description:
					'Implementation of enterprise resource planning system',
				startDate: new Date('2024-01-10'),
				endDate: new Date('2024-12-31'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[4].id,
				nature: 'PROGRAM',
			},
		}),
		prisma.project.create({
			data: {
				title: 'AI Chatbot Development',
				description:
					'Development of intelligent customer service chatbot',
				startDate: new Date('2024-04-01'),
				endDate: new Date('2024-07-31'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[1].id,
				nature: 'INTELLECTUAL',
			},
		}),
		prisma.project.create({
			data: {
				title: 'Legacy System Modernization',
				description:
					'Modernization of legacy systems to current technology stack',
				startDate: new Date('2024-03-15'),
				endDate: new Date('2024-11-30'),
				status: 'CONTROLLED_IN_PROGRESS',
				companyId: companies[2].id,
				nature: 'SERVICES',
			},
		}),
	]);

	console.log('📋 Created 8 projects');

	// Company project counts are represented via relations; no direct update needed

	console.log('✅ Seeding completed successfully!');
	console.log('\n📊 Summary:');
	console.log(`   - ${companies.length} companies created`);
	console.log(`   - ${contacts.length} contacts created`);
	console.log(`   - ${projects.length} projects created`);
	console.log('\n🚀 Your API is now ready for testing!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error('❌ Seeding failed:', e);
		await prisma.$disconnect();
		process.exit(1);
	});
