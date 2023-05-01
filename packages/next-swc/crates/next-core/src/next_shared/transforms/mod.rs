mod modularize_imports;
mod next_dynamic;
mod next_font;
mod next_strip_page_exports;

pub use modularize_imports::{get_next_modularize_imports_rule, ModularizeImportPackageConfig};
pub use next_dynamic::get_next_dynamic_transform_rule;
pub use next_font::get_next_font_transform_rule;
pub use next_strip_page_exports::get_next_pages_transforms_rule;
use swc_core::{
    common::util::take::Take,
    ecma::ast::{Module, ModuleItem, Program},
};
use turbo_binding::turbopack::{
    core::reference_type::{ReferenceType, UrlReferenceSubType},
    turbopack::module_options::{ModuleRule, ModuleRuleCondition, ModuleRuleEffect, ModuleType},
};

use crate::next_image::StructuredImageModuleTypeVc;

/// Returns a rule which applies the Next.js dynamic transform.
pub fn get_next_image_rule() -> ModuleRule {
    ModuleRule::new(
        ModuleRuleCondition::any(vec![
            ModuleRuleCondition::ResourcePathEndsWith(".jpg".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".jpeg".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".png".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".webp".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".avif".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".apng".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".gif".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".svg".to_string()),
        ]),
        vec![ModuleRuleEffect::ModuleType(ModuleType::Custom(
            StructuredImageModuleTypeVc::new().into(),
        ))],
    )
}

pub(crate) fn module_rule_match_js_no_url() -> ModuleRuleCondition {
    ModuleRuleCondition::all(vec![
        ModuleRuleCondition::not(ModuleRuleCondition::ReferenceType(ReferenceType::Url(
            UrlReferenceSubType::Undefined,
        ))),
        ModuleRuleCondition::any(vec![
            ModuleRuleCondition::ResourcePathEndsWith(".js".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".jsx".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".ts".to_string()),
            ModuleRuleCondition::ResourcePathEndsWith(".tsx".to_string()),
        ]),
    ])
}

pub(crate) fn unwrap_module_program(program: &mut Program) -> Program {
    match program {
        Program::Module(module) => Program::Module(module.take()),
        Program::Script(s) => Program::Module(Module {
            span: s.span,
            body: s
                .body
                .iter()
                .map(|stmt| ModuleItem::Stmt(stmt.clone()))
                .collect(),
            shebang: s.shebang.clone(),
        }),
    }
}
